import MainStage from 'Pages/Admin/MainStage';
import AdminMainStageStore from 'Pages/Admin/MainStage/Store';
import AdminMainStageChat from 'Pages/Admin/MainStage/Chat';

export default [
    // Frontend

    // Admin
    { path: '/admin/main-stage', component: MainStage, guards: ['admin'] },
    { path: '/admin/main-stage/store/:session?', component: AdminMainStageStore, guards: ['admin'] },
    { path: '/admin/main-stage/chat/:session?', component: AdminMainStageChat, guards: ['admin'] },
];
