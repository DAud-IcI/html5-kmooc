var o7h8ae, O7H8AE;

var evolution = ("create_specimen" in window) ? window.create_specimen : false;

(function()
{
    // constants
    var WALK_UP = 0, WALK_LEFT = 1, WALK_DOWN = 2, WALK_RIGHT = 3;
    var RANGE4 = function() { return [0, 1, 2, 3]; };
    var OPPOSITES = [WALK_DOWN, WALK_RIGHT, WALK_UP, WALK_LEFT];
    //var SIDES = [ [WALK_LEFT, WALK_RIGHT], [WALK_DOWN, WALK_UP], [WALK_RIGHT, WALK_LEFT], [WALK_UP, WALK_DOWN] ];
    var CELL_EMPTY = 0, CELL_PELLET = 1, CELL_MONSTER = 2, CELL_PLAYER = 3, CELL_WALL = 4;
    
    // map arrays
    var map = undefined;
    var map_graph = undefined;

    // general functions
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
    
    function displaceCoordinates(x, y, direction)
    {
        var distance = 1;
        switch(direction)
        {
            case WALK_UP: return { x: x, y: y - distance };
            case WALK_LEFT: return { x: x - distance, y: y };
            case WALK_DOWN: return { x: x, y: y + distance };
            case WALK_RIGHT: return { x: x + distance, y: y };
        }
        return { x: x, y: y };
    }

    function getDirection(c1, c2)
    {
        var x1 = c1.x, y1 = c1.y, x2 = c2.x, y2 = c2.y;
        if (x1 < x2) return WALK_RIGHT;
        if (x2 < x1) return WALK_LEFT;
        if (y1 < y2) return WALK_DOWN;
        if (y2 < y1) return WALK_UP;
    }
    
    function parseMap(map_id)
    {
        map       = [];
        map_graph = [];
        
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
    
    function checkCell(x,y)
    {
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

    function createRobot(options)
    {
        // default configs
        var MAX_PEEK = 5, PELLET_SEEK = 2, NEARBY_PREFER = 5.0, MONSTER_AVOID = 200, PLAYER_AVOID = 2, BACKTRACK_AVOID = 100;

        // update configs from options object if any
        if (options && typeof (options) === "object")
            for (var name in options)
                switch(name)
                {
                    case "MAX_PEEK"       : MAX_PEEK        = options[name]; break;
                    case "PELLET_SEEK"    : PELLET_SEEK     = options[name]; break;
                    case "NEARBY_PREFER"  : NEARBY_PREFER   = options[name]; break;
                    case "MONSTER_AVOID"  : MONSTER_AVOID   = options[name]; break;
                    case "PLAYER_AVOID"   : PLAYER_AVOID    = options[name]; break;
                    case "BACKTRACK_AVOID": BACKTRACK_AVOID = options[name]; break;
                }
        
        // 1 step memory to reduce the chance of oscillation
        var prev_dir = {};

    
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

        var cycle = 0;
        function robotAi(player_id, x, y, map_id, dont_trigger)
        {
            if (map_graph === undefined)
                parseMap(map_id); // load map on first step
            if (! (player_id in prev_dir) )
                prev_dir[player_id] = -1;

            var direction = -1;

            var coords = { x: x, y: y};
            var value = RANGE4()
                .map(function(direction)
                {
                    var c = displaceCoordinates(x, y, direction);
                    return map_graph[c.y][c.x].is_wall ? -Infinity : evaluatePath(c, coords, OPPOSITES[direction], 0);
                });
            if (prev_dir[player_id] != -1)
                value[OPPOSITES[prev_dir[player_id]]] -= BACKTRACK_AVOID;
            //console.log(value);
            var best = max(value);
            var dirs = shuffle(RANGE4());
            for (var i = 0; i < 4; i++)
                if (value[dirs[i]] == best)
                    direction = dirs[i];

            
            prev_dir[player_id] = direction;
            if (dont_trigger !== true)
                jQuery("body").trigger(
                    {
                        type: "refreshmap",
                        name: player_id,
                        walk: direction
                    });
            return direction;
        }

        return {
                genes     : options,
                behaviour : robotAi,
                fitness   : 0,
            };
    }

    o7h8ae = O7H8AE = createRobot().behaviour;

    if (!evolution) return;

    var specimen = [];
    for (var i = 0; i < 100; i++)
    {
        var options = {
            MAX_PEEK        : Math.floor(Math.random() * 19) + 1,
            PELLET_SEEK     : Math.random() * 100,
            NEARBY_PREFER   : Math.random() * 100,
            MONSTER_AVOID   : Math.random() * 300,
            PLAYER_AVOID    : Math.random() * 100,
            BACKTRACK_AVOID : Math.random() * 200,
        };

        specimen.push(createRobot(options));
    }

    function exposePopulation(specimen)
    {
        for (var i = 0; i < specimen.length; i++)
            window['s' + i] = specimen[i].behaviour;
    }

    function repopulate()
    {
        var winners = specimen.sort(function(a,b) { return b.fitness - a.fitness }); // selection: the top 5% based on fitness
        specimen = [];

        for (var alpha = 0; alpha < 4; alpha++)
        {
            for (var beta = alpha + 1; beta < 5; beta++)
            {
                // mating : everyone with everyone 10 times => 100 specimen for the next generation
                var a = winners[alpha], b = winners[beta];
                for(var i = 0; i < 10; i++)
                {
                    var new_genes = {};
                    for (var gene in a.genes)
                    {
                        var percent = Math.random() * 20 + 50;
                        new_genes[gene] = a.genes[gene] * percent + b.genes[gene] * (100 - percent) / 200; // gene flow: towards the mean with random 0-20% bias for the dominant partner
                        new_genes[gene] += new_genes * (Math.random() * 0.1 - 0.05); // ±5% random mutation
                    }
                    specimen.push(createRobot(new_genes));
                }
            }
        }

        shuffle(specimen);
        
        evolution = { specimen : specimen, cycle : evolution.cycle + 1 };
        exposePopulation(specimen);
    }

    function moveSimulate(name, x, y, walk, map)
    {
        var coords = displaceCoordinates(x, y, walk);
        if (checkCell(coords.x, coords.y) == CELL_WALL) return { x: x, y: y };

        jQuery(map[y][x])
            .addClass('field')
            .removeClass(name);
        var next = jQuery(map[coords.y][coords.x])
            .addClass(name)
            .removeClass('field');
        
        var blue = next.hasClass('blue');
        var green = next.hasClass('green');
        var has_monster = next[0]
            .className
            .split(' ')
            .filter(function(x) { return monsters.indexOf(x) >= 0; })
            .length > 0
            ;
        if (blue || green)
        {
            if (has_monster)
            {
                if (blue)
                {
                    window.players.blue.state = false;
                    next.removeClass('blue');
                }
                else
                {
                    window.players.green.state = false;
                    next.removeClass('green');
                }
            }
            else if (next.text().indexOf(1) >= 0)
            {
                next.text('');
                var index = players[blue ? 'blue' : 'green'].name.replace('s','');
                specimen[parseInt(index)].fitness++;
            }
        }
        return coords;
    }

    evolution = { specimen : specimen, cycle : 0 };
    exposePopulation(specimen);

    var monsters = 'm0 m1 m2 m3 m4'.split(' ');
    jQuery(function()
    {
        var TIMER_STEP = 50;
        var evolve = jQuery('<button id="evolve">evolve!</button>');
        jQuery('#start').after(evolve);
        evolve.click(function()
        {
            parseMap("map");
            window.simulate = true;
            // simulate games
            var log = document.getElementById('log');
            log.textContent = JSON.stringify(specimen.genes);

            for(var p1 = 0; p1 < 1; p1++)
            {
                for (var p2 = p1 + 1; p2 < 2; p2++)
                {
                    log.textContent += '\n\nASSIGN PLAYERS: s' + p1 + ' vs s' + (p2) + '\n';
                    
                    var players = window.players;
                    players.blue  = { name: 's' + p1, x: 1, y: 1, sleep: 100, state: true, score: 0, move: window['s' + p1] };
                    players.green = { name: 's' + (p2), x: map[map.length - 2].length - 2, y: map.length - 2, sleep: 100, state: true, score: 0, move: window['s' + (p2)] };
        
                    (function (map, players)
                    {
                        for (var cy = 0; cy < map.length; cy++)
                            for (var cx = 0; cx < map[cy].length; cx++)
                            {
                                if (map[cy][cx] == 0) map[cy][cx] = 1;
                                jQuery('#m' + cx + '_' + cy)
                                    .text(map[cy][cx])
                                    .attr('class', 'map' + map[cy][cx] + ' field')
                                    ;
                            }
                
                        players["m0"].x = 14; players["m0"].y = 14;
                        players["m1"].x = 14; players["m1"].y = 15;
                        players["m2"].x = 15; players["m2"].y = 15;
                        players["m3"].x = 13; players["m3"].y = 14;
                        players["m4"].x = 14; players["m4"].y = 13;
                
                        for (x in players)
                        {
                            $("#m" + players[x].x + "_" + players[x].y).removeClass("field");
                            $("#m" + players[x].x + "_" + players[x].y).addClass(x);
                            //players[x].move(x, players[x].x, players[x].y, "map");
                        }
                    })(window.map, window.players);
        
                    for(var i = 0; i < 60000; i += TIMER_STEP)
                        Object.keys(players).forEach(function(entity) {
                            var player = players[entity];
                            if (!player.state || i % player.sleep !== 0) return;
                            var walk = (entity == "green" || entity == "blue") ?
                                player.move(entity, player.x, player.y, "map", true) :
                                Math.floor(Math.random() * 4);
                            var coords = moveSimulate(entity, player.x, player.y, walk, map);
                            player.x = coords.x;
                            player.y = coords.y;
                        });
                    log.textContent += '\n\ns' + p1 + ': ' + specimen[p1].fitness +
                        ' s' + p2 + ': ' + specimen[p2].fitness + '\n';
                }
            }
            window.simulate = false;
        })
    });
})();