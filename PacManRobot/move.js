var o7h8ae;

(function()
{
var WALK_UP = 0, WALK_LEFT = 1, WALK_DOWN = 2, WALK_RIGHT = 3;
var RANGE4 = function() { return [0, 1, 2, 3]; };
var OPPOSITES = [WALK_DOWN, WALK_RIGHT, WALK_UP, WALK_LEFT];
var SIDES = [ [WALK_LEFT, WALK_RIGHT], [WALK_DOWN, WALK_UP], [WALK_RIGHT, WALK_LEFT], [WALK_UP, WALK_DOWN] ];

var CELL_EMPTY = 0, CELL_PELLET = 1, CELL_MONSTER = 2, CELL_PLAYER = 3, CELL_WALL = 4;
var NO_GO = [CELL_MONSTER, CELL_WALL];
var MAX_PEEK = 30;
var PELLET_SEEK = 1, NEARBY_PREFER = 5.0; MONSTER_AVOID = 30, PLAYER_AVOID = 2;
var AVOID_RADIUS = 4, AVOID_DELTA = 0.2, AVOID_COOLDOWN = 5;

var map_elem = undefined;
var map = undefined;

function min(arr) { return Math.min.apply(null, arr); };
function max(arr) { return Math.max.apply(null, arr); };
function sort(arr) { return jQuery(arr).sort().toArray(); }
function shuffle(arr)
{
    var len = arr.length, tmp;

    while (len > 0)
    {
        i = Math.floor(Math.random() * len--);
        tmp = arr[len];
        arr[len] = arr[i];
        arr[i] = tmp;
    }

  return arr;
}

var avoidance = {};
var excitement = {};

var cycle = 0;
o7h8ae = function (player_id, x, y, map_id)
{
    if (map_elem === undefined)
        parseMap(map_id); // load map on first step
    if (! (player_id in avoidance) )
        avoidance[player_id] = AVOID_RADIUS;
    if (! (player_id in excitement) )
        excitement[player_id] = 0;
        console.log('cycle #' + cycle++, avoidance[player_id], excitement[player_id]);

    var direction;
    var monster_potential = RANGE4().map(function(d) { return countMonsters( x, y, d, Math.floor(avoidance[player_id]) ); });

    // flight behaviour
    if (max(monster_potential) > 0)
    {
        direction = flight(x, y, monster_potential);
        avoidance[player_id] += AVOID_DELTA;
        excitement[player_id] = AVOID_COOLDOWN;
    }
    // forage behaviour
    else
    {
        excitement[player_id]--;
        if (excitement[player_id] < 0 && avoidance[player_id] > AVOID_RADIUS)
            avoidance[player_id] = AVOID_RADIUS;

        var value = [0, 0, 0, 0];
        for(var d = 0; d < 4; d++)
            for(var i = 1; i < MAX_PEEK; i++)
                switch(peek(x, y, d, i))
                {
                    case CELL_EMPTY  : break;
                    case CELL_PELLET : value[d] += PELLET_SEEK   * NEARBY_PREFER / i; break;
                    case CELL_MONSTER: value[d] -= MONSTER_AVOID * NEARBY_PREFER / i; break;
                    case CELL_PLAYER : value[d] -= PLAYER_AVOID  * NEARBY_PREFER / i ; break;
                    case CELL_WALL   : i += MAX_PEEK; break
                }
    
        direction = value.indexOf(max(value));
    }

    return dispatch(player_id, direction);
}

function flight(x, y, monster_potential)
{
    var direction = Math.floor(Math.random() * 4); // fallback behaviour

    var danger = sort(monster_potential); // run towards lowest danger
    for (var i = 0; i < 4; i++)
        if (i == 0 || danger[i] != danger[i - 1])
        {
            var least_danger = danger[i];
            var shuffled_directions = shuffle(RANGE4());
            for (var j = 0; j < 4; j++)
            {
                var d = shuffled_directions[j];
                if (monster_potential[d] == least_danger && NO_GO.indexOf(peek(x, y,d, 1)) < 0)
                    return d; 
            }

        }

    return direction;
}

function dispatch(player_id, direction)
{
    return jQuery("body")
    .trigger({
        type: "refreshmap",
        name: player_id,
        walk: direction
    });
}

function parseMap(map_id)
{
    map_elem = document.getElementById(map_id);
    map = [];

    var width = jQuery('#map div[id^="m0_"]').length;

    var i = 0;
    var row = [];
    map.push(row);

    jQuery('#map div')
        .each(function()
        {
            if (i >= width)
            {
                row = [];
                map.push(row);
                i = 0;
            }

            row.push(this);

            i++;
        });
}

function displaceCoordinates(x, y, direction, distance)
{
    switch(direction)
    {
        case WALK_UP: return { x: x, y: y - distance };
        case WALK_LEFT: return { x: x - distance, y: y };
        case WALK_DOWN: return { x: x, y: y + distance };
        case WALK_RIGHT: return { x: x + distance, y: y };
    }
    return { x: x, y: y };
}

function checkCell(x,y)
{
    if (map[y] === undefined)
        qwe = 1; // for testing
    var cell = jQuery(map[y][x]);
    var cell_text = cell.text();

    if (cell_text == '9')
        return CELL_WALL;
    if (cell.hasClass('blue') || cell.hasClass('green'))
        return CELL_PLAYER;
    if (cell.hasClass('m0') || cell.hasClass('m1') || cell.hasClass('m2') || cell.hasClass('m3') || cell.hasClass('m4'))
        return CELL_MONSTER;
    if (cell_text == '1')
        return CELL_PELLET;
    return CELL_EMPTY;
}

function peek(x, y, direction, distance)
{
    var coord = displaceCoordinates(x, y, direction, distance);
    return checkCell(coord.x, coord.y);
}

function countMonsters(x, y, direction, distance)
{
    var coord = displaceCoordinates(x, y, direction, 1);
    var cell_type = checkCell(coord.x, coord.y);
    if (cell_type == CELL_WALL) return 0;

    var is_monster = cell_type == CELL_MONSTER;
    var monster_count = is_monster ? 1 : 0;
    
    distance--;
    if (distance == 0)
        return monster_count;
    else 
        return monster_count + max(
            [
                countMonsters(coord.x, coord.y, SIDES[direction][0], distance),
                countMonsters(coord.x, coord.y, direction, distance),
                countMonsters(coord.x, coord.y, SIDES[direction][1], distance),
            ]);
}

})();