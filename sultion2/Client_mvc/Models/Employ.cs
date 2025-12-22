using System.ComponentModel.DataAnnotations;

namespace Client_mvc.Models
{
    public class Employ
    {
        public int id { get; set; }
        [Display(Name ="الاسم")]
        public string name { get; set; }
        public string Adder { get; set; }
        public string nomber { get; set; }
        public Depart? depart { get; set; }


    }
}
