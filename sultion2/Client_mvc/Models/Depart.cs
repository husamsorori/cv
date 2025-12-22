using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Client_mvc.Models
{
    public class Depart
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [Display(Name ="الموقع")]
        public string Locatin { get; set; }
        public string? Adderss { get; set; }
        public int? Employid { get; set; }
        [ForeignKey("Employid")]
        public Employ? employ { get; set; }

    }
}
