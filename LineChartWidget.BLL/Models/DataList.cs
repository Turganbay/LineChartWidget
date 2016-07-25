using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LineChartWidget.BLL.Models
{
    public class DataList
    {
        public int product_id { get; set; }
        public string product_name { get; set; }
        public string sales_date { get; set; }
        public int quantity { get; set; } 
    }
}