using Microsoft.AspNetCore.StaticFiles;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();



var app = builder.Build();


// allow browser access to all server endpoint with all methods GET,POST,PUT...
app.UseCors(options =>
{
    options.WithOrigins("*")
    .AllowAnyMethod()
    .AllowAnyHeader();
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


// POST http://localhost:5206/directory
app.MapPost("/directory", async (HttpContext context) =>
{
    var request = await context.Request.ReadFromJsonAsync<DirectoryRequest>();

    if (request == null)
    { // not a valid json request
        return Results.BadRequest();
    }
    var dirInfo = new DirectoryInfo(request.Path);
    if (!dirInfo.Exists)
    { // not a valid directory path
        return Results.NotFound();
    }
    var files = dirInfo.GetFiles();
    var directories = dirInfo.GetDirectories();

    var filesInfo = files.Select(fileInfo => new FileData(
      fileInfo.Name, // name of file
      fileInfo.FullName, // full path of file
      GetMimeType(Path.GetExtension(fileInfo.FullName)), // image/png , application/pdf etc.
      false // not a directory
    )).ToArray();

    var directoriesInfo = directories.Select(directory => new FileData(
      directory.Name, // name of directory
      directory.FullName, // full path of directory
      "directory", // this is not a real mimeType, but a placeholder
      true // is a directory
    )).ToArray();

    var response = filesInfo.Concat(directoriesInfo).ToArray();
    return Results.Ok(new DirectoryResponse(response));
})
.WithName("GetDirectory")
.Accepts<DirectoryRequest>("application/json")
.Produces<DirectoryResponse>()
.WithOpenApi();


// POST http://localhost:5206/file
app.MapPost("/file", async (HttpContext context) =>
{
    var request = await context.Request.ReadFromJsonAsync<DirectoryRequest>();

    if (request == null)
    { // not a valid json request
        return Results.BadRequest();
    }

    var fullPath = Path.GetFullPath(request.Path);
    var mimeType = GetMimeType(Path.GetExtension(fullPath));
    var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
    return Results.File(fileStream, mimeType, enableRangeProcessing: true);
})
.WithName("GetFile")
.Accepts<DirectoryRequest>("application/json")
.WithOpenApi();

app.Urls.Add("http://localhost:5001");

app.Run();

// image/png, application/pdf 
static string GetMimeType(string extension)
{
    var provider = new FileExtensionContentTypeProvider();
    // if the extension is not a know extension mimeType is a stream of bytes
    if (!provider.TryGetContentType(extension, out var mimeType))
    {
        mimeType = "application/octet-stream";
    }
    return mimeType;
}


record FileData(string Name, string Path, string MimeType, bool isDirectory);


record DirectoryResponse(FileData[] Data);

record DirectoryRequest(string Path);
