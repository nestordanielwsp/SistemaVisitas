using API_Configuration.Dtos;
using API_Configuration.Models;

namespace API_Configuration.Data
{
    public interface IConfigurationAPIRepo
    {
        bool SaveChanges();

        //USERS
        void CreateUser(User user);
        IEnumerable<User> GetAllUsers(bool? isEnabled);
        IEnumerable<User> GetAllUsersByIds(IdListUpdateDto idListUpdateDto);

        void UserChangePassword(User user);
        void DeleteBulkUserRole(IdListDeleteDto idListDeleteDto);
        void CreateBulkUserRole(UserRole userRole);
        User? GetUserById(int id);

        //AREAS
        void CreateArea(Area area);
        IEnumerable<Area> GetAllAreas();
        IEnumerable<Area> GetAllAreasByIds(IdListUpdateDto idListUpdateDto);
        Area GetAreaById(int id);

        //MODULES
        void CreateModule(Module module);
        IEnumerable<Module> GetAllModules();
        IEnumerable<Module> GetAllModulesByIds(IdListUpdateDto idListUpdateDto);
        Module GetModuleById(int id);

        //VIEWS
        void CreateView(View view);
        IEnumerable<View> GetAllViews(int? filterModuleId);
        IEnumerable<View> GetAllViewsByIds(IdListUpdateDto idListUpdateDto);
        View? GetViewById(int id);
        
        //ROLES
        void CreateRole(Role role);
        IEnumerable<Role> GetAllRoles();
        IEnumerable<Role> GetAllRolesAvailableToUser(int userId);
        IEnumerable<Role> GetAllRolesByIds(IdListUpdateDto idListUpdateDto);
        Role GetRoleById(int id);
        void CreateBulkRoleView(RoleView roleView);
        void DeleteBulkRoleView(IdListDeleteDto idListDeleteDto);

    }
}
