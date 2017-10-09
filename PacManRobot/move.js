var WALK_UP = 0, WALK_LEFT = 1, WALK_DOWN = 2, WALK_RIGHT = 3;

function o7h8ae(player_id, x, y, map_elem)
{
    var direction = WALK_UP;

    console.log('TODO');

    dispatchEvent(map_elem, 'refreshmap', { name: player_id, walk: direction });
}

function dispatchEvent(event_target, event_name, params)
{
    var event;

    // event constructor supported?
    if ('Event' in window && 'constructor' in window.Event)
    {
        event = new CustomEvent(event_name, params);
        event_target.dispatchEvent(event);
    }
    // falling back to legacy/depricated event dispatch
    else
    {
        var document = map_elem.ownerDocument;
    
        event = document.createEvent('Event');
        event.initEvemt(event_name, true, true);
        
        for(var key in params)
            event[key] = params[key];
    }
    
    return event_target.dispatchEvent(event);
}