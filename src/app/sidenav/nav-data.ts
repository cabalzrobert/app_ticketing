import { RouterLink } from "@angular/router";
import { faWindowClose, faBookBible, faDashboard } from "@fortawesome/free-solid-svg-icons";
export const navbarData = [
    {
        routerLink: 'overview',
        icon: 'fa fa-th-large',
        label: 'Overview'
    },
    {
        routerLink: 'ticket',
        icon: 'fa fa-light fa-ticket-alt',
        label: 'Tickets'
    },
    {
        routerLink: 'assignedticket',
        icon: 'fa fa-light fa-ticket-alt',
        label: "Assigned Tickets"
    },
    {
        routerLink: 'receivedtickets',
        icon: 'fa fa-light fa-ticket-alt',
        label: 'Received Ticket'
    },
    {
        routerLink: 'users',
        icon: 'fa fa-light fa-user-friends',
        label: 'Users'
    },
    /*
    {
        routerLink: 'chat',
        icon: 'fa fa-light fa-comment',
        label: 'Chat'
    },
    */
    {
        routerLink: 'adminsettings',
        icon: 'fa fa-cog',
        label: 'Settings'
    }
];