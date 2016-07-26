using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LineChartWidget.BLL.Models;
using LineChartWidget.BLL.Repositories;

namespace LineChartWidget.Controllers
{
    public class HomeController : Controller
    {
        Repository repo;
        public HomeController() 
        {
            repo = new Repository();
        }

        // GET: /Home/
        public ActionResult Index()
        {
            return View();
        }

      
        // get sales by date
        public JsonResult GetSalesByDate(string from_date, string to_date)
        {
            List<DataList> list = repo.GetSalesByDate(from_date, to_date);

            return Json(list, JsonRequestBehavior.AllowGet);
        }


    }
}
