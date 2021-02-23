import AgendaIndex from 'Pages/Agenda';
import AdminAgendaIndex from 'Pages/Admin/Agenda';
import AdminAgendaStore from 'Pages/Admin/Agenda/store';

export default [
	// Frontend
	{ path: '/agenda', component: AgendaIndex, guards: ['auth'] },

	// Admin
	{ path: '/admin/agenda', component: AdminAgendaIndex, guards: ['admin'] },
    { path: '/admin/agenda/store/:agenda?', component: AdminAgendaStore, guards: ['admin'] },
];
