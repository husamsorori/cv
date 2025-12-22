using System.Net.Http;
using Client_mvc.Model;
using Client_mvc.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Common;

namespace Client_mvc.Controllers
{
    public class UserController : Controller
    {
        private readonly HttpClient _httpclient = new HttpClient();

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Login(UserLogin userlogin)
        {
            var res = await _httpclient.PostAsJsonAsync<UserLogin>("https://localhost:7282/api/Users/Login\r\n", userlogin);
            if (res.IsSuccessStatusCode)
            {
                var read = await res.Content.ReadFromJsonAsync<Token>();
                TempData["sms"] = "تم الدخول بنجاح";
                return RedirectToAction("Index", "Depart");
            }

            return View(userlogin);

        }
    }
}
