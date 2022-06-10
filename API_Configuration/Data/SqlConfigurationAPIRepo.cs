using API_Configuration.Dtos;
using API_Configuration.Models;
using Microsoft.EntityFrameworkCore;

namespace API_Configuration.Data
{
    public class SqlConfigurationAPIRepo : IConfigurationAPIRepo
    {
        private readonly ConfigurationContext context;
        public SqlConfigurationAPIRepo(ConfigurationContext context)
        {
            this.context = context;
        }

        //AREAS
        public void CreateArea(Area area)
        {
            if(area == null)
            {
                throw new ArgumentNullException(nameof(area));
            }

            context.Areas.Add(area);
        }
        public IEnumerable<Area> GetAllAreas()
        {
            return context.Areas.ToList();
        }
        public IEnumerable<Area> GetAllAreasByIds(IdListUpdateDto idListUpdateDto)
        {
            return context.Areas.Where(a => idListUpdateDto.IdList.Contains(a.AreaId)).ToList();
        }
        public Area GetAreaById(int id)
        {
            return context.Areas.FirstOrDefault(a => a.AreaId == id);
        }

        //MODULES
        public void CreateModule(Module module)
        {
            if (module == null)
            {
                throw new ArgumentNullException(nameof(module));
            }

            context.Modules.Add(module);
        }
        public IEnumerable<Module> GetAllModules()
        {
            return context.Modules.ToList();
        }
        public IEnumerable<Module> GetAllModulesByIds(IdListUpdateDto idListUpdateDto)
        {
            return context.Modules.Where(m => idListUpdateDto.IdList.Contains(m.ModuleId)).ToList();
        }
        public Module GetModuleById(int id)
        {
            return context.Modules.FirstOrDefault(m => m.ModuleId == id);
        }

        //VIEWS
        public void CreateView(View view)
        {
            if(view == null)
            {
                throw new ArgumentNullException(nameof(view));
            }

            context.Views.Add(view);
        }
        public IEnumerable<View> GetAllViews(int? filterModuleId)
        {
            return context.Views.Where(v=>v.ModuleId == filterModuleId || filterModuleId == null).Include(v => v.Module).ToList();
        }
        public IEnumerable<View> GetAllViewsByIds(IdListUpdateDto idListUpdateDto)
        {
            return context.Views.Where(m => idListUpdateDto.IdList.Contains(m.ViewId)).ToList();
        }
        public View? GetViewById(int id)
        {
            return context.Views.Where(mv => mv.ViewId == id).Include(v=>v.Module).FirstOrDefault();
        }

        //ROLES
        public void CreateRole(Role role)
        {
            if(role == null)
            {
                throw new ArgumentNullException(nameof(role));
            }

            context.Roles.Add(role);
        }
        public IEnumerable<Role> GetAllRolesByIds(IdListUpdateDto idListUpdateDto)
        {
            return context.Roles.Where(m => idListUpdateDto.IdList.Contains(m.RoleId)).ToList();
        }
        public IEnumerable<Role> GetAllRoles()
        {
            return context.Roles.Include(r=>r.Module).Include(r=>r.RoleViews).ThenInclude(rv => rv.View).ToList();
        }
        public IEnumerable<Role> GetAllRolesAvailableToUser(int userId)
        {
            List<UserRole> userRoles = context.UserRoles.Where(ur => ur.UserId == userId).Include(ur=>ur.Role).ToList();
            List<int> moduleIds = userRoles.Select(ur => ur.Role.ModuleId).ToList();
            return context.Roles.Where(r=> !moduleIds.Contains(r.ModuleId)).Include(r => r.Module).Include(r => r.RoleViews).ThenInclude(rv => rv.View).ToList();
        }
        public Role? GetRoleById(int id)
        {
            return context.Roles.Where(r => r.RoleId == id).Include(r=>r.Module).Include(r => r.RoleViews).ThenInclude(rv => rv.View).FirstOrDefault();
        }
        public void DeleteBulkRoleView(IdListDeleteDto idListDeleteDto)
        {
            var roleViews = context.RoleViews.Where(rv => idListDeleteDto.IdList.Contains(rv.RoleViewId)).ToList();
            context.RoleViews.RemoveRange(roleViews);
        }

        //USERS
        public void CreateUser(User user)
        {
            if(user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            context.Users.Add(user);
        }
        public void CreateBulkUserRole(UserRole userRole)
        {
            if (userRole == null)
            {
                throw new ArgumentNullException(nameof(userRole));
            }
            var moduleId = context.Roles.First(r => r.RoleId == userRole.RoleId).ModuleId;
            var userRoles = context.UserRoles.Where(ur => ur.UserId == userRole.UserId).Include(ur => ur.Role);
            var hasModule = (userRoles.FirstOrDefault(r => r.Role.ModuleId == moduleId) != null);

            if(!hasModule)
                context.UserRoles.Add(userRole);
        }
        public void UserChangePassword(User user)
        {
            context.Users.Update(user);
        }
        public IEnumerable<User> GetAllUsers(bool? isEnabled)
        {
            return context.Users.Where(u => u.IsEnabled == isEnabled || isEnabled == null).Include(u => u.Area).ToList();
        }
        public IEnumerable<User> GetAllUsersByIds(IdListUpdateDto idListUpdateDto)
        {
            return context.Users.Where(u => idListUpdateDto.IdList.Contains(u.UserId)).ToList();
        }
        public User? GetUserById(int id)
        {
            return context.Users.Where(u=>u.UserId == id)
                                    .Include(u => u.Area)
                                    .Include(u => u.UserRoles)
                                    .ThenInclude(ur => ur.Role.Module)
                                    .Include(u => u.UserRoles)
                                    .ThenInclude(ur => ur.Role.RoleViews)
                                    .ThenInclude(rv => rv.View)
                                    .FirstOrDefault();
        }
        public void DeleteBulkUserRole(IdListDeleteDto idListDeleteDto)
        {
            var userRoles = context.UserRoles.Where(ur => idListDeleteDto.IdList.Contains(ur.UserRoleId)).ToList();
            context.UserRoles.RemoveRange(userRoles);
        }

        public bool SaveChanges()
        {
            return (context.SaveChanges() >= 0);
        }

        public void CreateBulkRoleView(RoleView roleView)
        {
            if (roleView == null)
            {
                throw new ArgumentNullException(nameof(roleView));
            }

            context.RoleViews.Add(roleView);
        }
    }
}
