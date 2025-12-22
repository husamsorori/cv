using Microsoft.EntityFrameworkCore;
using Project_api.Model;

namespace Project_api.Data
{
    public class ProjDbcontext:  DbContext
        
    {
        public ProjDbcontext(DbContextOptions<ProjDbcontext> options):base(options) { }
       

        public DbSet<Employ> Employs { get; set; }
        public DbSet<Depart> Departs  { get; set; }
        public DbSet<Cource> Cources  { get; set; }
        public DbSet<Colej> Colejs  { get; set; }
        public DbSet<User> Users  { get; set; }


    }

}
