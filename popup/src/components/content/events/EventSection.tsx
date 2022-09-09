import * as React from 'react'
import { Event } from "../../../domain/event";
import { EventRow } from './EventMiddleSection';

interface EventSectionProps {
    title: string
    events: Event[]
}

export const EventSection = ({ events, title }: EventSectionProps) => {
    console.log("Transfers rendering", events)
    if (events.length === 0) return;
    return (<div>
        <div className="title">
            {title}
        </div>
        {
            events.map(event =>
                <EventRow key={`${event.from}${event.to}${event.token.address}`} event={event} />)
        }
    </div>
    )
}