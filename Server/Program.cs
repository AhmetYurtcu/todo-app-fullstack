using Microsoft.EntityFrameworkCore;
using Server.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Veritabanı Bağlantısını Tanıtıyoruz
// appsettings.json dosyasındaki "DefaultConnection"ı okuyup PostgreSQL'e bağlanır.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. CORS Ayarı (Çok Önemli!)
// React (farklı portta çalışacağı için) buradan veri isterken "Yasak" yememesi için izin veriyoruz.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.AllowAnyOrigin() // Her yerden gelen isteği kabul et (Localhost vs)
                        .AllowAnyHeader()
                        .AllowAnyMethod()); // GET, POST, PUT, DELETE hepsine izin ver
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Geliştirme modundaysak Swagger (Test ekranı) açık olsun
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Yukarıda tanımladığımız CORS iznini devreye al
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();