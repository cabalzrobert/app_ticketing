import { RouterLink } from "@angular/router";
import { faWindowClose, faBookBible, faDashboard } from "@fortawesome/free-solid-svg-icons";
export const navbarData = [
    {
        routerLink: 'overview',
        icon: 'fa fa-th-large',
        label: 'Overview'
    },
    // {
    //     routerLink: 'ticket',
    //     icon: 'fa fa-light fa-ticket-alt',
    //     label: 'My Tickets'
    // },
    {
        routerLink: 'assignedticket',
        icon: 'fa fa-light fa-ticket-alt',
        label: "Assigned Tickets"
    },
    {
        routerLink: 'receivedtickets',
        icon: 'fa fa-light fa-ticket-alt',
        label: 'Cases'
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
export const navbarDataCommunicator = [
    {
        routerLink: 'overview',
        icon: 'fa fa-th-large',
        label: 'Overview'
    },
    {
        routerLink: 'ticket',
        icon: 'fa fa-light fa-ticket-alt',
        label: 'Submitted Tickets'
    },
    {
        routerLink: 'receivedtickets',
        icon: 'fa fa-light fa-ticket-alt',
        label: 'Cases'
    },
];
export const navbarDataDepartmentHead = [
    {
        routerLink: 'overview',
        icon: 'fa fa-th-large',
        label: 'Overview'
    },
    {
        routerLink: 'ticket',
        icon: 'fa fa-light fa-ticket-alt',
        label: 'Submitted Tickets'
    },
    {
        routerLink: 'assignedticket',
        icon: 'fa fa-light fa-ticket-alt',
        label: "Assigned Tickets"
    }
    
];
export const navbarDataCommunicatorDepartmentHead = [
    {
        routerLink: 'overview',
        icon: 'fa fa-th-large',
        label: 'Overview'
    },
    {
        routerLink: 'ticket',
        icon: 'fa fa-light fa-ticket-alt',
        label: 'Submitted Tickets'
    },
    {
        routerLink: 'assignedticket',
        icon: 'fa fa-light fa-ticket-alt',
        label: "Assigned Tickets"
    },
    {
        routerLink: 'receivedtickets',
        icon: 'fa fa-light fa-ticket-alt',
        label: 'Cases'
    }
    
];

export const navbarDataPersonnel = [
    {
        routerLink: 'overview',
        icon: 'fa fa-th-large',
        label: 'Overview'
    },
    {
        routerLink: 'ticket',
        icon: 'fa fa-light fa-ticket-alt',
        label: 'Submitted Tickets'
    },
    {
        routerLink: 'assignedticket',
        icon: 'fa fa-light fa-ticket-alt',
        label: "Assigned Tickets"
    }
    
];
export const navbarDataUser = [
    {
        routerLink: 'overview',
        icon: 'fa fa-th-large',
        label: 'Overview'
    },
    {
        routerLink: 'ticket',
        icon: 'fa fa-light fa-ticket-alt',
        label: 'Submitted Tickets'
    },
     {
        routerLink: 'assignedticket',
        icon: 'fa fa-light fa-ticket-alt',
        label: "Assigned Tickets"
    },
    
];