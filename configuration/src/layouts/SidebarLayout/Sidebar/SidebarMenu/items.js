import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import AppsIcon from '@mui/icons-material/Apps';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';

const menuItems = [
  {
    heading: 'Management',
    items: [
      {
        name: 'Users',
        icon: AccountCircleTwoToneIcon,
        link: '/management/users',
        items: [
          {
            name: 'List',
            link: '/management/users/list'
          },
          {
            name: 'New User',
            link: '/management/users/new-user'
          }
        ]
      },
      {
        name: 'Areas',
        icon: AppsIcon,
        link: '/management/areas',
        items: [
          {
            name: 'List',
            link: '/management/areas/list'
          },
          {
            name: 'New Area',
            link: '/management/areas/new-area'
          }
        ]
      },
      {
        name: 'Modules',
        icon: AssignmentReturnIcon,
        link: '/management/modules',
        items: [
          {
            name: 'List',
            link: '/management/modules/list'
          },
          {
            name: 'New Module',
            link: '/management/modules/new-module'
          }
        ]
      },
      {
        name: 'Views',
        icon: ViewCarouselIcon,
        link: '/management/views',
        items: [
          {
            name: 'List',
            link: '/management/views/list'
          },
          {
            name: 'New View',
            link: '/management/views/new-view'
          }
        ]
      },
      {
        name: 'Roles',
        icon: VpnKeyIcon,
        link: '/management/roles',
        items: [
          {
            name: 'List',
            link: '/management/roles/list'
          },
          {
            name: 'New Role',
            link: '/management/roles/new-role'
          }
        ]
      }
    ]
  }
];

export default menuItems;
