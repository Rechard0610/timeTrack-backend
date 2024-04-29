const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const { hasPermission } = require('@/middlewares/permission');
const appControllers = require('@/controllers/appControllers');
// const taskcontroller = require('@/controllers/appControllers/taskController');
const { routesList } = require('@/models/utils');

const routerApp = (entity, controller) => {
  router
    .route(`/${entity}/create`)
    .post(hasPermission('create'), catchErrors(controller['create']));
  router.route(`/${entity}/read/:id`).get(hasPermission('read'), catchErrors(controller['read']));
  router
    .route(`/${entity}/updateAll`)
    .patch(hasPermission('update'), catchErrors(controller['updateAll']));
  router
    .route(`/${entity}/update/:id`)
    .patch(hasPermission('update'), catchErrors(controller['update']));
  router
    .route(`/${entity}/delete/:id`)
    .delete(hasPermission('delete'), catchErrors(controller['delete']));
  router.route(`/${entity}/search`).get(hasPermission('read'), catchErrors(controller['search']));
  router.route(`/${entity}/list`).get(hasPermission('read'), catchErrors(controller['list']));
  router.route(`/${entity}/count`).get(hasPermission('read'), catchErrors(controller['count'])); // it is for projectnumber
  router.route(`/${entity}/listAll`).get(hasPermission('read'), catchErrors(controller['listAll']));
  router.route(`/${entity}/filter`).get(hasPermission('read'), catchErrors(controller['filter']));
  router.route(`/${entity}/summary`).get(hasPermission('read'), catchErrors(controller['summary']));

  if (entity === 'invoice' || entity === 'quote' || entity === 'offer' || entity === 'payment') {
    router.route(`/${entity}/mail`).post(hasPermission('update'), catchErrors(controller['mail']));
  }

  if (entity === 'quote') {
    router
      .route(`/${entity}/convert/:id`)
      .get(hasPermission('update'), catchErrors(controller['convert']));
  }

  if (entity === 'task') {
    router
      .route(`/${entity}/budget/:id`)
      .get(hasPermission('read'), catchErrors(controller['budget']));

    router
      .route(`/${entity}/updateChild`)
      .post(hasPermission('read'), catchErrors(controller['updateChild']));
  }
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

module.exports = router;
