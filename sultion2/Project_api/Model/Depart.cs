using System.ComponentModel.DataAnnotations.Schema;

namespace Project_api.Model
{
    public class Depart
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Locatin { get; set; }
        public string? Adderss { get; set; }
        public int? Employid { get; set; }
        [ForeignKey("Employid")]
        public Employ? employ { get; set; }
    }
}
