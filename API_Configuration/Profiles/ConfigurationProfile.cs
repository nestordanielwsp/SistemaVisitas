using API_Configuration.Dtos;
using API_Configuration.Models;
using AutoMapper;

namespace API_Configuration.Profiles
{
    public class ConfigurationProfile : Profile
    {
        public ConfigurationProfile()
        {
            CreateMap<User, UserReadDto>();
            CreateMap<UserCreateDto, User>();
            CreateMap<UserUpdateDto, User>();

            CreateMap<Area, AreaReadDto>();
            CreateMap<AreaCreateDto, Area>();
            CreateMap<AreaUpdateDto, Area>();

            CreateMap<Module, ModuleReadDto>();
            CreateMap<ModuleCreateDto, Module>();
            CreateMap<ModuleUpdateDto, Module>();

            CreateMap<View, ViewReadDto>();
            CreateMap<ViewCreateDto, View>();
            CreateMap<ViewUpdateDto, View>();

            CreateMap<Role, RoleReadDto>();
            CreateMap<RoleCreateDto, Role>();
            CreateMap<RoleUpdateDto, Role>();

            CreateMap<RoleViewCreateDto, RoleView>();
            CreateMap<RoleView, RoleViewReadDto>();

            CreateMap<UserRoleCreateDto, UserRole>();
            CreateMap<UserRole, UserRoleReadDto>();
        }
    }
}
