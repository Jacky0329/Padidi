using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using PADIDI.API.Data;
using PADIDI.API.Middleware;
using PADIDI.API.Services;
using PADIDI.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// DbContexts
builder.Services.AddDbContext<AdminDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("AdminDb")));
builder.Services.AddDbContext<ClientDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("ClientDb")));

// AutoMapper
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret not configured");
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Services
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAdminAuthService, AdminAuthService>();
builder.Services.AddScoped<IUploadService, UploadService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IAdService, AdService>();
builder.Services.AddScoped<IBuyerAuthService, BuyerAuthService>();
builder.Services.AddScoped<IAdminUserService, AdminUserService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto-apply migrations in development
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var adminDb = scope.ServiceProvider.GetRequiredService<AdminDbContext>();
    await adminDb.Database.MigrateAsync();
    var clientDb = scope.ServiceProvider.GetRequiredService<ClientDbContext>();
    await clientDb.Database.MigrateAsync();

    app.UseSwagger();
    app.UseSwaggerUI();

    // Seed default admin
    await SeedData.SeedDefaultAdminAsync(app.Services, app.Configuration);
}

app.UseMiddleware<GlobalExceptionMiddleware>();

// Static files for uploads
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "..", "..", "uploads");
Directory.CreateDirectory(uploadsPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.GetFullPath(uploadsPath)),
    RequestPath = "/uploads"
});

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
