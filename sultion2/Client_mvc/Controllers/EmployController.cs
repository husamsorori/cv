using Client_mvc.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Client_mvc.Controllers
{
    
    public class EmployController : Controller
    {
        private readonly HttpClient _httpClient = new HttpClient();
        // get
        public async Task<IActionResult> Index()
        {
            var emp =await _httpClient.GetFromJsonAsync<List<Employ>>("https://localhost:7282/api/Employs");
            return View(emp);
        }
        //create post
        public IActionResult Create()
        {
            
            return View();
        }
        public async Task<IActionResult> Create( Employ employ)
        {
            var emp = await _httpClient.PostAsJsonAsync("",employ);
            if (emp.IsSuccessStatusCode) 
            {
             var data = await emp.Content.ReadAsStringAsync();
                var data_emp  = JsonConvert.DeserializeObject<Employ>(data);
                if (data_emp != null) 
                {
                return RedirectToAction(nameof(Index));
                }
            }
            return View(emp);
        }
        // edit put
        public IActionResult Edit()
        {
            return View();
        }
        //Delete d
        public IActionResult Delete ()
        {
            return View();
        }
    }
}
