var o7h8ae;

(function()
{
var WALK_UP = 0, WALK_LEFT = 1, WALK_DOWN = 2, WALK_RIGHT = 3;
var RANGE4 = function() { return [0, 1, 2, 3]; };
var OPPOSITES = [WALK_DOWN, WALK_RIGHT, WALK_UP, WALK_LEFT];
var SIDES = [ [WALK_LEFT, WALK_RIGHT], [WALK_DOWN, WALK_UP], [WALK_RIGHT, WALK_LEFT], [WALK_UP, WALK_DOWN] ];

var CELL_EMPTY = 0, CELL_PELLET = 1, CELL_MONSTER = 2, CELL_PLAYER = 3, CELL_WALL = 4;
var NO_GO = [CELL_MONSTER, CELL_WALL];
var MAX_PEEK = 5;
var PELLET_SEEK = 2, NEARBY_PREFER = 5.0; MONSTER_AVOID = 200, PLAYER_AVOID = 2, BACKTRACK_AVOID = 100;

var map_elem = undefined;
var map = undefined;
var map_graph = undefined;

var prev_dir = {};

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

var cycle = 0;
o7h8ae = function (player_id, x, y, map_id)
{
    if (map_elem === undefined)
        parseMap(map_id); // load map on first step
    if (! (player_id in prev_dir) )
        prev_dir[player_id] = -1;

    var direction = -1;//Math.floor(Math.random() * 4); // fallback behaviour

    var coords = { x: x, y: y};
    var value = RANGE4()
        .map(function(direction)
        {
            var c = displaceCoordinates(x, y, direction, 1);
            return map_graph[c.y][c.x].is_wall ? -Infinity : evaluatePath(c, coords, OPPOSITES[direction], 0);
        });
    if (prev_dir[player_id] != -1)
        value[OPPOSITES[prev_dir[player_id]]] -= BACKTRACK_AVOID;
    console.log(value);
    var best = max(value);
    var dirs = shuffle(RANGE4());
    for (var i = 0; i < 4; i++)
        if (value[dirs[i]] == best)
            direction = dirs[i];

    
    prev_dir[player_id] = direction;
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

    map_graph = [];
    for (var r = 0; r < map.length; r++)
    {
        row = [];
        for (var c = 0; c < map[r].length; c++)
        {
            row.push(
                {
                    x : c,
                    y : r,
                    is_wall : checkCell(c, r) == CELL_WALL,
                    neighbours : [],
                });
        }
        map_graph.push(row);
    }
    
    for (var r = 0; r < map_graph.length; r++)
        for (var c = 0; c < map_graph[r].length; c++)
        {
            var cell = map_graph[r][c];
            if (r > 0 && !map_graph[r - 1][c].is_wall)
                cell.neighbours.push(map_graph[r - 1][c]);
            if (c > 0 && !map_graph[r][c - 1].is_wall)
                cell.neighbours.push(map_graph[r][c - 1]);
            if (r < map_graph.length - 1 && !map_graph[r + 1][c].is_wall)
                cell.neighbours.push(map_graph[r + 1][c]);
            if (c < map_graph[r].length - 1 && !map_graph[r][c + 1].is_wall)
                cell.neighbours.push(map_graph[r][c + 1]);
        }
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

function getDirection(c1, c2)
{
    var x1 = c1.x, y1 = c1.y, x2 = c2.x, y2 = c2.y;
    if (x1 < x2) return WALK_RIGHT;
    if (x2 < x1) return WALK_LEFT;
    if (y1 < y2) return WALK_DOWN;
    if (y2 < y1) return WALK_UP;
}

function evaluatePath(current, origin, exclude_direction, distance)
{
    var dist_mod = NEARBY_PREFER / (distance + 1);

    var cell_type = checkCell(current.x, current.y);
    if (cell_type == CELL_MONSTER)
        return -1 * MONSTER_AVOID * dist_mod;
    
    var value = (cell_type == CELL_PELLET) ? (PELLET_SEEK * dist_mod) :
                (cell_type == CELL_PLAYER) ? (-PLAYER_AVOID * dist_mod) :
                0;
    var curr = map_graph[current.y][current.x];
    if (distance < MAX_PEEK)
        for (var i = 0; i < curr.neighbours.length; i++)
            if (getDirection(current, curr.neighbours[i]) != exclude_direction)
                value += evaluatePath(curr.neighbours[i], origin, exclude_direction, distance + 1);
    
    return value;
}

})();