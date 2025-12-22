using System.Diagnostics;
using System.Net.Http;
using Client_mvc.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Common;

namespace Client_mvc.Controllers
{
    public class HomeController : Controller
    {
        private readonly HttpClient _httpclient = new HttpClient();

        public IActionResult Index()
        {
            return View();
        }
        //[HttpPost]
        //public async Task<IActionResult> Login(Userlogin userlogin)
        //{
        //    var res = await _httpclient.PostAsJsonAsync<Userlogin>("https://localhost:7265/api/Users/Userlogin", userlogin);
        //    if (res.IsSuccessStatusCode)
        //    {
        //            return RedirectToAction("Index", "Employs");
        //    }

        //    return View(userlogin);

        //}
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
