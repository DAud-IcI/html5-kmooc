var points = [];


var it = ["fel", "balra", "le", "jobra"];
var map = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    [9, 1, 9, 9, 9, 1, 1, 9, 9, 9, 9, 9, 1, 9, 9, 1, 9, 9, 9, 9, 9, 1, 1, 9, 9, 9, 1, 9],
    [9, 1, 9, 9, 9, 1, 1, 9, 9, 9, 9, 9, 1, 9, 9, 1, 9, 9, 9, 9, 9, 1, 1, 9, 9, 9, 1, 9],
    [9, 1, 9, 9, 9, 1, 1, 9, 9, 9, 9, 9, 1, 9, 9, 1, 9, 9, 9, 9, 9, 1, 1, 9, 9, 9, 1, 9],
    [9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    [9, 1, 9, 9, 9, 1, 1, 9, 9, 1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 9, 9, 1, 1, 9, 9, 9, 1, 9],
    [9, 1, 9, 9, 9, 1, 1, 9, 9, 1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 9, 9, 1, 1, 9, 9, 9, 1, 9],
    [9, 1, 1, 1, 1, 1, 1, 9, 9, 1, 1, 1, 1, 9, 9, 1, 1, 1, 1, 9, 9, 1, 1, 1, 1, 1, 1, 9],
    [9, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 1, 1, 1, 1, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 1, 1, 1, 1, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 1, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 1, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 1, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 1, 9, 9, 9, 9, 9, 9],
    [9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    [9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    [9, 9, 9, 9, 9, 9, 1, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 1, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 1, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 1, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 1, 1, 1, 1, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 1, 1, 1, 1, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 9],
    [9, 1, 1, 1, 1, 1, 1, 9, 9, 1, 1, 1, 1, 9, 9, 1, 1, 1, 1, 9, 9, 1, 1, 1, 1, 1, 1, 9],
    [9, 1, 9, 9, 9, 1, 1, 9, 9, 1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 9, 9, 1, 1, 9, 9, 9, 1, 9],
    [9, 1, 9, 9, 9, 1, 1, 9, 9, 1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 9, 9, 1, 1, 9, 9, 9, 1, 9],
    [9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    [9, 1, 9, 9, 9, 1, 1, 9, 9, 9, 9, 9, 1, 9, 9, 1, 9, 9, 9, 9, 9, 1, 1, 9, 9, 9, 1, 9],
    [9, 1, 9, 9, 9, 1, 1, 9, 9, 9, 9, 9, 1, 9, 9, 1, 9, 9, 9, 9, 9, 1, 1, 9, 9, 9, 1, 9],
    [9, 1, 9, 9, 9, 1, 1, 9, 9, 9, 9, 9, 1, 9, 9, 1, 9, 9, 9, 9, 9, 1, 1, 9, 9, 9, 1, 9],
    [9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
];


var players = {
    blue: { name: "move", x: 1, y: 1, sleep: 100, state: true, score: 0, move: function (pname, px, py, pmap) { } },
    green: { name: "move", x: map[map.length - 2].length - 2, y: map.length - 2, sleep: 100, state: true, score: 0, move: function (pname, px, py, pmap) { } },

    m0: { x: 14, y: 14, sleep: 50, state: true, score: 0, move: function (pname, px, py, pmap) { move(pname, px, py, pmap); } },
    m1: { x: 14, y: 15, sleep: 50, state: true, score: 0, move: function (pname, px, py, pmap) { move(pname, px, py, pmap); } },
    m2: { x: 15, y: 15, sleep: 50, state: true, score: 0, move: function (pname, px, py, pmap) { move(pname, px, py, pmap); } },
    m3: { x: 13, y: 14, sleep: 50, state: true, score: 0, move: function (pname, px, py, pmap) { move(pname, px, py, pmap); } },
    m4: { x: 14, y: 13, sleep: 50, state: true, score: 0, move: function (pname, px, py, pmap) { move(pname, px, py, pmap); } }
};
var startime;
var size = map.length - 1;
var running = false;
var x = 1; y = 1;

$(document).ready(function ()
{

    $("#blueplayer").change(function ()
    {
        $("#blueplayer option:selected").each(function ()
        {
            var str = $(this).html();
            players["blue"].move = function (pname, px, py, pmap) { eval(str + "(pname,px,py,pmap)"); };
            players["blue"].name = str;
        });
    });

    $("#greenplayer").change(function ()
    {
        $("#greenplayer option:selected").each(function ()
        {
            var str = $(this).html();
            players["green"].move = function (pname, px, py, pmap) { eval(str + "(pname,px,py,pmap)"); };
            players["green"].name = str;
        });
    });

    //palya merete                
    width = Math.floor($(window).width() / map[0].length - 2);
    height = Math.floor($(window).height() / map.length - 2);
    $("#map").css("width", "" + (map[0].length * height) + "px");
    //init data
    for (var cy = 0; cy < map.length; cy++)
        for (var cx = 0; cx < map[cy].length; cx++)
        {
            $("#map").append("<div class=\"map" + map[cy][cx] + "\" id='m" + cx + "_" + cy + "'>" + map[cy][cx] + "</div>");
        }

    $("#map div").addClass("field");
    $("#map div").css("width", "" + height + "px");
    $("#map div").css("min-height", "" + height + "px");


    $(document).on("refreshmap", refreshMapHandler);

    $("#start").click(function ()
    {
        $("#blue").html("0");
        $("#green").html("0");
        running = true;
        for (var cy = 0; cy < map.length; cy++)
            for (var cx = 0; cx < map[cy].length; cx++)
                if (map[cy][cx] == 0) map[cy][cx] = 1;


        $("#map div").addClass("field");
        for (x in players)
            $("#m" + players[x].x + "_" + players[x].y).removeClass("" + x);

        $("#blueplayer").change();
        $("#greenplayer").change();
        $(".map1").html(1);
        players["blue"].x = 1;
        players["blue"].y = 1;
        players["blue"].score = 0;
        players["blue"].state = true;
        players["green"].x = map[map.length - 2].length - 2;
        players["green"].y = map.length - 2;
        players["green"].score = 0;
        players["green"].state = true;
        players["m0"].x = 14; players["m0"].y = 14;
        players["m1"].x = 14; players["m1"].y = 15;
        players["m2"].x = 15; players["m2"].y = 15;
        players["m3"].x = 13; players["m3"].y = 14;
        players["m4"].x = 14; players["m4"].y = 13;

        startime = new Date().getTime();

        for (x in players)
        {
            $("#m" + players[x].x + "_" + players[x].y).removeClass("field");
            $("#m" + players[x].x + "_" + players[x].y).addClass(x);
            players[x].move(x, players[x].x, players[x].y, "map");
        }
    });
});


function refreshMapHandler(e)
{
    try
    {
        x = players[e.name].x;
        y = players[e.name].y;
        xd = x - 1; xa = x + 1; yd = y - 1; ya = y + 1;
        var res = e.walk;
        $("#m" + x + "_" + y).removeClass(e.name);
        $("#m" + x + "_" + y).addClass("field");

        if (res == 0 && map[yd][x] != 9) y = y - 1;
        if (res == 1 && map[y][xd] != 9) x = x - 1;
        if (res == 2 && map[ya][x] != 9) y = y + 1;
        if (res == 3 && map[y][xa] != 9) x = x + 1;

        var ascore = parseInt(map[y][x]);
        players[e.name].y = y;
        players[e.name].x = x;

        if (e.name == "green" || e.name == "blue")
        {
            map[y][x] = 0;
            players[e.name].score += ascore;
            $("#" + e.name).html("" + players[e.name].score);
            $("#m" + x + "_" + y).html("");
            $("#future").html("" + $("#map div:contains('1')").length);
        }
        monsterBlue = 0;
        monsterGreen = 0;
        for (i in players)
        {
            if (i != "blue")
                if (players[i].x == players["green"].x && players[i].y == players["green"].y) monsterGreen++;
            if (i != "green")
                if (players[i].x == players["blue"].x && players[i].y == players["blue"].y) monsterBlue++;
        }

        if (monsterBlue > 1) players["blue"].state = false;
        if (monsterGreen > 1) players["green"].state = false;
    }
    catch (e) { players[e.name].state = false; }

    if (players[e.name].state && e.timeStamp < (startime + 60000) && (players["blue"].state || players["green"].state) && ($("#map div:contains('1')").length > 0))
    {
        $("#m" + x + "_" + y).addClass(e.name);
        if (window.simulate !== true)
        setTimeout(players[e.name].move, players[e.name].sleep, e.name, players[e.name].x, players[e.name].y, "map");
    }

    if ((e.name == "blue" || e.name == "green") && running)
    {
        if (!(players["blue"].state || players["green"].state) || ($("#map div:contains('1')").length == 0) || e.timeStamp > (startime + 60000))
        {
            running = false;
            $("#log").append(players["blue"].name + "-" + $("#greenplayer option:selected").html() + ":" + $("#blue").html() + "-" + $("#green").html() + "<br>");

            if (players["blue"].score > players["green"].score)
            {
                if (points[players["blue"].name] == undefined)
                {
                    points[players["blue"].name] = 3;
                }
                else points[players["blue"].name] = points[players["blue"].name] + 3;
            }
            else if (players["blue"].score < players["green"].score)
            {
                if (points[players["green"].name] == undefined) points[players["green"].name] = 3;
                else points[players["green"].name] = points[players["green"].name] + 3;
            }
            else if (players["blue"].score == players["green"].score)
            {
                if (points[players["green"].name] == undefined) points[players["green"].name] = 1;
                else points[players["green"].name] = points[players["green"].name] + 1;
                if (points[players["blue"].name] == undefined) points[players["blue"].name] = 1;
                else points[players["blue"].name] = points[players["blue"].name] + 1;
            }

            $("#tabella").html("");
            for (x in points)
                $("#tabella").append(x + ":" + points[x] + "<br>");
            setTimeout(nextPlay, 2000);
        }

    }
}

function nextPlay()
{
    if (!running)
    {
        var ln = $("#greenplayer option").length - 1;
        var idxg = $("#greenplayer option:selected").index();
        var idxb = $("#blueplayer option:selected").index();


        if (idxg < ln)
        {
            $("#greenplayer option:selected").next().attr("selected", "true");
            $("#start").click();
        }
        else alert("vege");

    }
}

function event()
{
    for (x in players)
        move(x, players[x].x, players[x].y, "map");
}


(function fixExternalLinks()
{
    function pointToBlank(a)
    {
        var href = a.getAttribute("href");
        if (href && href.indexOf("//") > -1)
        {
            // this is an external link.
            if (!a.getAttribute("target"))
            {
                a.setAttribute("target", "_blank");
            }
        }
    }
    function fixLinks()
    {
        document.removeEventListener("DOMContentLoaded", fixLinks);
        var anchors = document.querySelectorAll("a");
        var asArray = Array.prototype.slice.call(anchors);
        asArray.forEach(function (a)
        {
            pointToBlank(a);
        });
    }
    document.addEventListener("DOMContentLoaded", fixLinks);
}())