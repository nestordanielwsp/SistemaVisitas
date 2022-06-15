using API_Configuration.Data;
using API_Configuration.Helpers;
using API_Configuration.Interfaces;
using API_Configuration.Middleware;
using API_Configuration.Services;
using Microsoft.EntityFrameworkCore;
 
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins,
                          policy =>
                          {
                              policy.WithOrigins("http://est03des.magna.global",
                                                  "http://127.0.0.1:5500",
                                                  "http://13.68.142.29")
                                                  .AllowAnyHeader()
                                                  .AllowAnyMethod();
                          });
});


//public IConfiguration Configuration { get;}

// Add services to the container.

builder.Services.AddScoped<IConfigurationAPIRepo, SqlConfigurationAPIRepo>();

builder.Services.AddControllers();

builder.Services.AddDbContext<ConfigurationContext>(opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("API_ConfigurationContext")));

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient();


builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

builder.Services.AddScoped<IJwtUtils, JwtUtils>();

builder.Services.AddScoped<IUserService, UserService>();



var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.UseCors(e => e.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseMiddleware<ErrorHandlerMiddleware>();

app.UseMiddleware<JwtMiddleware>();

app.MapControllers();

app.Run();
