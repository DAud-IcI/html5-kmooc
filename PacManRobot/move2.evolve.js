var evolution = true;
// a variant of move2.js that doesn't use jQuery or the DOM at all, it will build from map_base
(function()
{
    // constants
    var WALK_UP = 0, WALK_LEFT = 1, WALK_DOWN = 2, WALK_RIGHT = 3;
    var RANGE4 = function() { return [0, 1, 2, 3]; };
    var OPPOSITES = [WALK_DOWN, WALK_RIGHT, WALK_UP, WALK_LEFT];
    var CELL_EMPTY = 0, CELL_PELLET = 1, CELL_MONSTER = 2, CELL_PLAYER = 3, CELL_WALL = 4, CELL_GREEN = 5, CELL_BLUE = 6;
    
    // map arrays
    var map = undefined;
    var map_graph = undefined;

    // general functions
    function min(arr) { return Math.min.apply(null, arr); };
    function max(arr) { return Math.max.apply(null, arr); };
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
    
    function parseMap(map_base)
    {
        map       = map_base.map(r => r.map(x => [x === 9 ? CELL_WALL : CELL_PELLET]) );
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
                        is_wall : map_base[r][c] === 9,
                        neighbours : RANGE4()
                            .map(d => displaceCoordinates(c, r, d))
                            .filter(coords => coords.x >= 0 && coords.y >= 0 && coords.x < map[0].length && coords.y < map.length && map[coords.y][coords.x] !== 9),
                    });
            }
            map_graph.push(row);
        }
    }
    
    function checkCell(x,y)
    {
        if (map_graph[y][x].is_wall)
            return CELL_WALL;
        if (map[y][x].indexOf(CELL_PLAYER) >= 0)
            return CELL_PLAYER;
        if (map[y][x].indexOf(CELL_MONSTER) >= 0)
            return CELL_MONSTER;
        if (map[y][x].indexOf(CELL_PELLET))
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
            distance++;
            var dist_mod = NEARBY_PREFER / distance;
            
            var has = type => map[current.y][current.x].indexOf(type) >= 0;

            if (has(CELL_MONSTER))
                return -1 * MONSTER_AVOID * dist_mod;
            
            var value = 0;
            if (has(CELL_PELLET)) value += PELLET_SEEK * dist_mod;
            if (has(CELL_PLAYER)) value -= PLAYER_AVOID * dist_mod;

            var curr = map_graph[current.y][current.x];
            if (distance < MAX_PEEK)
                for (var i = 0; i < curr.neighbours.length; i++)
                    if (getDirection(current, curr.neighbours[i]) != exclude_direction)
                        value += evaluatePath(curr.neighbours[i], origin, exclude_direction, distance);
            
            return value;
        }

        var generation = 0;
        function robotAi(player_id, x, y)
        {
            if (map_graph === undefined)
                parseMap(window.map_base); // load map on first step
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
            return direction;
        }

        return {
                genes     : options,
                behaviour : robotAi,
                fitness   : 0,
            };
    }

    if (!evolution) return;

    var specimen = [];
    for (var i = 0; i < 40; i++)
    {
        var options = {
            MAX_PEEK        : 5, // previous random experimentation has shown that 5 gives the best results
            PELLET_SEEK     : Math.random() * 100,
            NEARBY_PREFER   : Math.random() * 100,
            MONSTER_AVOID   : Math.random() * 300,
            PLAYER_AVOID    : Math.random() * 100,
            BACKTRACK_AVOID : Math.random() * 200,
        };

        specimen.push(createRobot(options));
    }

    function repopulate()
    {
        var winners = specimen.sort(function(a,b) { return b.fitness - a.fitness }); // selection: the top 5% based on fitness
        specimen = [];

        for (var alpha = 0; alpha < 4; alpha++)
        {
            for (var beta = alpha + 1; beta < 5; beta++)
            {
                var a = winners[alpha], b = winners[beta];
                for(var i = 0; i < 4; i++)// everyone of the top 5 mates 4 times
                {
                    var new_genes = {};
                    for (var gene in a.genes)
                    {
                        if (gene === "MAX_PEEK")
                        { new_genes.MAX_PEEK = 5; continue; }
                        var percent = Math.random() * 20 + 50;
                        new_genes[gene] = (a.genes[gene] * percent + b.genes[gene] * (100 - percent)) / 200; // gene flow: towards the mean with random 0-20% bias for the dominant partner
                        new_genes[gene] += new_genes[gene] * (Math.random() * 0.1 - 0.05); // ±5% random mutation
                        
                    }
                    specimen.push(createRobot(new_genes));
                }
            }
        }

        shuffle(specimen);
        
        evolution = { specimen : specimen, generation : evolution.generation + 1 };
    }

    function moveSimulate(players, name, x, y, walk)
    {
        var next = displaceCoordinates(x, y, walk);
        if ( walk < 0 || walk > 3 || map_graph[next.y][next.x].is_wall)
            return { x: x, y: y };

        var current_player = players[name];
        var current_player_type =
            name === "blue"  ? CELL_BLUE  :
            name === "green" ? CELL_GREEN :
            CELL_MONSTER;
        var is_player = current_player_type !== CELL_MONSTER;
            
        var has    = (x, y, type) => map[y][x].indexOf(type) >= 0;
        var add    = (x, y, type) => { if (!has(x, y, type)) map[y][x].push(type); }
        var remove = (x, y, type) => { var i = map[y][x].indexOf(type); if (i >= 0) map[y][x].splice(i, 1) };

        remove(x, y, current_player_type);
        add(next.x, next.y, current_player_type);
        if (is_player)
        {
            remove(x, y, CELL_PLAYER);
            add(next.x, next.y, CELL_PLAYER);
        }

        if (is_player || has(next.x, next.y, CELL_PLAYER)) // next cell has a player
        {
            if (!is_player || has(next.x, next.y, CELL_MONSTER)) // next cell has a monster
            {
                if (name === "blue" || has(next.x, next.y, CELL_BLUE)) // player is blue
                {
                    players.blue.state = false;
                    remove(next.x, next.y, CELL_BLUE);
                }
                else // player is green
                {
                    players.green.state = false;
                    remove(next.x, next.y, CELL_GREEN);
                }

                remove(next.x, next.y, CELL_PLAYER);
            }
            else if (has(next.x, next.y, CELL_PELLET)) // increase fitness by 1 if next cell has pellet
            {
                specimen[current_player.name].fitness++;
                remove(next.x, next.y, CELL_PELLET);
            }
        }

        return next;
    }

    evolution = { specimen : specimen, generation : 0 };

    var monsters = 'm0 m1 m2 m3 m4'.split(' ');
    document.addEventListener('DOMContentLoaded', function()
    {
        var TIMER_STEP = 50;

        var log = document.getElementById('log');
        log.style.backgroundColor = 'black';
        log.style.color = "#3d4";
        log.textContent = '[\n\t' + specimen.map(x => JSON.stringify(x.genes)).join(',\n\t') + '\n]';

        document.getElementById('evolve').addEventListener('click', function()
        {

            var generation_begin = new Date();
            for(var p1 = 0; p1 < specimen.length - 1; p1++)
            {
                for (var p2 = p1 + 1; p2 < specimen.length; p2++)
                {
                    var battle_begin = new Date();
                    parseMap(window.map_base);
                    var players = window.players = getPlayers(p1, specimen[p1].behaviour, p2, specimen[p2].behaviour, map);
                    
                    //log.textContent += '\n\nASSIGN PLAYERS: s' + p1 + ' vs s' + (p2) + '\n';
                            
                    for(var i = 0; i < 60000; i += TIMER_STEP)
                        Object.keys(players)
                            .forEach(function(entity)
                            {
                                if (players[entity].state === false)
                                { delete players[entity]; return; }
                                if (i % players[entity].sleep !== 0) return;
                                
                                var p = players[entity];
                                var walk = (entity == "green" || entity == "blue") ?
                                    p.move(entity, p.x, p.y) : Math.floor(Math.random() * 4);
                                var next = moveSimulate(players, entity, p.x, p.y, walk);
                                p.x = next.x;
                                p.y = next.y;
                            });

                    //log.textContent += '\ns' + p1 + ': ' + specimen[p1].fitness +
                    //    ' s' + p2 + ': ' + specimen[p2].fitness + '(' + ( (new Date() - battle_begin) / 1000) + 's)\n';
                }
            }
            var winner = evolution.specimen.map(x => x).sort((a,b) => b.fitness - a.fitness)[0];
            var max_fitness = winner.fitness / (specimen.length - 1);
            log.textContent += '\n' + JSON.stringify(winner.genes);
            
            log.textContent += '\ngeneration #' + (evolution.generation + 1) + ' (max fitness: ' + max_fitness + "; duration: " + ( (new Date() - generation_begin) / 1000) + 's)\n';
            repopulate();

        });
    });
})();