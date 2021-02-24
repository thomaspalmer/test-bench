import MainStage from 'Pages/MainStage';

import AdminMainStage from 'Pages/Admin/MainStage';
import AdminMainStageStore from 'Pages/Admin/MainStage/Store';
import AdminMainStageChat from 'Pages/Admin/MainStage/Chat';
import AdminMainStageReactions from 'Pages/Admin/MainStage/Reactions';

export default [
    // Frontend
    { path: '/main-stage', component: MainStage, guards: ['auth'] },

    // Admin
    { path: '/admin/main-stage', component: AdminMainStage, guards: ['admin'] },
    { path: '/admin/main-stage/store/:session?', component: AdminMainStageStore, guards: ['admin'] },
    { path: '/admin/main-stage/chat/:session?', component: AdminMainStageChat, guards: ['admin'] },
    { path: '/admin/main-stage/reactions/:session?', component: AdminMainStageReactions, guards: ['admin'] },
];
