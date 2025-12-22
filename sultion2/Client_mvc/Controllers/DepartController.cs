using Client_mvc.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Client_mvc.Controllers
{
    public class DepartController : Controller
    {
     private readonly   HttpClient _httpclient = new HttpClient();
        // get
        public async Task<IActionResult> Index()
        {
           
            var depart = await _httpclient.GetFromJsonAsync<List<Depart>>
                ("https://localhost:7282/api/Departs\r\n");
            return View(depart);
        }

        public  IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task <IActionResult> Create(Depart depart)
        {
            var departs =await _httpclient.PostAsJsonAsync
                ("https://localhost:7282/api/Departs", depart);
            if (departs.IsSuccessStatusCode) 
            {
                var data = await departs.Content.ReadAsStringAsync();
                var depart_list = JsonConvert.DeserializeObject(data);
                return RedirectToAction(nameof(Index));
                    }
            return View(departs);
        }
        public async Task< IActionResult> Edit( int id)
        {
            var depart = await _httpclient.GetFromJsonAsync<Depart>
               ("https://localhost:7282/api/Departs" +"/"+id);
            return View(depart);
        }
        [HttpPost]
        public async Task<IActionResult> Edit(Depart depart, int id) 
        {
            var responce_depart = await _httpclient.PutAsJsonAsync("https://localhost:7282/api/Departs" + "/" + id, depart);
            if (responce_depart.IsSuccessStatusCode)
            {
                TempData["sms"] = "تم التعديل بنجاح";
                ViewBag.error = "تم التعديل بنجاح1";
                return RedirectToAction(nameof(Index));
            }
            ViewBag.error = "فشل التعديل بنجاح";
            TempData["sms"] = "1فشل التعديل بنجاح";
            return View(depart);

        }
        public async Task<IActionResult> Delete(int id)
        {
            var depart = await _httpclient.GetFromJsonAsync<Depart>
               ("https://localhost:7282/api/Departs" + "/" + id);
            return View(depart);
        }
        public async Task<IActionResult> Delete1(int id)
        {
            var responce_delete = await _httpclient.DeleteAsync("https://localhost:7282/api/Departs" + "/" + id);
            if (responce_delete.IsSuccessStatusCode)
            {
                return RedirectToAction (nameof(Index));
            }
            return View(responce_delete);
        }











        //public IActionResult Login()
        //{
        //    return View();
        //}
        //[HttpPost]
        //public async Task <IActionResult> Login(Depart depart)
        //{
        //    var log = await _httpclient.PostAsJsonAsync<Depart>("https://localhost:7282/api/Departs/login", depart);
        //    if (log.IsSuccessStatusCode)
        //    {
        //        TempData["sms"] = "jljl";
        //        return  RedirectToAction(nameof(Index));
        //    }
        //    ViewBag.erorr = "hhhhhhhh";
        //    return View(depart);
        //}

    }
}
