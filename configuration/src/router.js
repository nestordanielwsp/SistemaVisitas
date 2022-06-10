import { Suspense, lazy } from 'react';
import { Navigate, matchPath } from 'react-router-dom';
import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';
import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) => (
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Applications
const Users = Loader(lazy(() => import('src/content/applications/Users/List')));
const UserSettings = Loader(lazy(() => import('src/content/applications/Users/NewUser')));
const Areas = Loader(lazy(() => import('src/content/applications/Areas/List')));
const AreaSettings = Loader(lazy(() => import('src/content/applications/Areas/NewArea')));
const Modules = Loader(lazy(() => import('src/content/applications/Modules/List')));
const ModuleSettings = Loader(lazy(() => import('src/content/applications/Modules/NewModule')));
const Views = Loader(lazy(() => import('src/content/applications/Views/List')));
const ViewSettings = Loader(lazy(() => import('src/content/applications/Views/NewView')));
const Roles = Loader(lazy(() => import('src/content/applications/Roles/List')));
const RoleSettings = Loader(lazy(() => import('src/content/applications/Roles/NewRole')));


const Permissions = Loader(lazy(() => import('src/content/applications/Permissions')));

// Status
const Status404 = Loader(lazy(() => import('src/content/pages/Status/Status404')));
const Status500 = Loader(lazy(() => import('src/content/pages/Status/Status500')));
const StatusComingSoon = Loader(lazy(() => import('src/content/pages/Status/ComingSoon')));
const StatusMaintenance = Loader(lazy(() => import('src/content/pages/Status/Maintenance')));

const buildRoutes = (userRoutes) => {
  const routes = [
    {
      path: '*',
      element: <BaseLayout />,
      children: [
        {
          path: '/',
          element:
          <Navigate
            to={(userRoutes.filter(path => path === "/management/users/list").length > 0) ? "/management/users/list" : userRoutes[0]}
            replace />
        },
        {
          path: 'status',
          children: [
            {
              path: '/',
              element: (
                <Navigate
                  to="404"
                  replace
                />
              )
            },
            {
              path: '404',
              element: <Status404 />
            },
            {
              path: '500',
              element: <Status500 />
            },
            {
              path: 'maintenance',
              element: <StatusMaintenance />
            },
            {
              path: 'coming-soon',
              element: <StatusComingSoon />
            },
          ]
        },
        {
          path: '*',
          element: <Status404 />
        },
      ]
    },
    {
      path: 'management',
      element: (
        <SidebarLayout />
      ),
      children: [
        {
          path: '/',
          element: (
            <Navigate
              to="/management/users/list"
              replace
            />
          )
        },
        {
          path: 'users',
          children: [
            {
              path: '/',
              element: (
                <Navigate
                  to="/management/users/list"
                  replace
                />
              )
            },
            {
              path: 'list',
              children:[
                {
                  path: '/',
                  element : ((userRoutes.filter(path => path === "/management/users/list").length > 0) ? <Users /> : <Permissions />)
                },
                {
                  path: ':id',
                  element : ((userRoutes.filter(path => path === "/management/users/list/:id").length > 0) ? <UserSettings isNewUser={false} /> : <Permissions />)
                }
              ]
            },
            {
              path: 'new-user',
              element: ((userRoutes.filter(path => path === "/management/users/new-user").length > 0) ? <UserSettings isNewUser={true} /> : <Permissions />)
            },
          ]
        },
        {
          path: 'areas',
          children: [
            {
              path: '/',
              element: (
                <Navigate
                  to="/management/areas/list"
                  replace
                />
              )
            },
            {
              path: 'list',
              children:[
                {
                  path: '/',
                  element : ((userRoutes.filter(path => path === "/management/areas/list").length > 0) ? <Areas /> : <Permissions />)
                },
                {
                  path: ':id',
                  element : ((userRoutes.filter(path => path === "/management/areas/list/:id").length > 0) ? <AreaSettings isNewArea={false} /> : <Permissions />)
                }
              ]
            },
            {
              path: 'new-area',
              element: ((userRoutes.filter(path => path === "/management/areas/new-area").length > 0) ? <AreaSettings isNewArea={true} /> : <Permissions />)
            },
          ]
        },
        {
          path: 'modules',
          children: [
            {
              path: '/',
              element: (
                <Navigate
                  to="/management/modules/list"
                  replace
                />
              )
            },
            {
              path: 'list',
              children:[
                {
                  path: '/',
                  element : ((userRoutes.filter(path => path === "/management/modules/list").length > 0) ? <Modules /> : <Permissions />)
                },
                {
                  path: ':id',
                  element : ((userRoutes.filter(path => path === "/management/modules/list/:id").length > 0) ? <ModuleSettings isNewModule={false} /> : <Permissions />)
                }
              ]
            },
            {
              path: 'new-module',
              element: ((userRoutes.filter(path => path === "/management/modules/new-module").length > 0) ? <ModuleSettings isNewModule={true} /> : <Permissions />)
            },
          ]
        },
        {
          path: 'views',
          children: [
            {
              path: '/',
              element: (
                <Navigate
                  to="/management/views/list"
                  replace
                />
              )
            },
            {
              path: 'list',
              children:[
                {
                  path: '/',
                  element : ((userRoutes.filter(path => path === "/management/views/list").length > 0) ? <Views /> : <Permissions />)
                },
                {
                  path: ':id',
                  element : ((userRoutes.filter(path => path === "/management/views/list/:id").length > 0) ? <ViewSettings isNewView={false} /> : <Permissions />)
                }
              ]
            },
            {
              path: 'new-view',
              element: ((userRoutes.filter(path => path === "/management/views/new-view").length > 0) ? <ViewSettings isNewView={true} /> : <Permissions />)
            },
          ]
        },
        {
          path: 'roles',
          children: [
            {
              path: '/',
              element: (
                <Navigate
                  to="/management/roles/list"
                  replace
                />
              )
            },
            {
              path: 'list',
              children:[
                {
                  path: '/',
                  element : ((userRoutes.filter(path => path === "/management/roles/list").length > 0) ? <Roles /> : <Permissions />)
                },
                {
                  path: ':id',
                  element : ((userRoutes.filter(path => path === "/management/roles/list/:id").length > 0) ? <RoleSettings isNewRole={false} /> : <Permissions />)
                }
              ]
            },
            {
              path: 'new-role',
              element: ((userRoutes.filter(path => path === "/management/roles/new-role").length > 0) ? <RoleSettings isNewRole={true} /> : <Permissions />)
            },
          ]
        },
      ]
    }
  ];

  return routes;
}


export default buildRoutes;
