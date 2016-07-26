using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LineChartWidget.DAL.Domain;
using LineChartWidget.BLL.Models;

namespace LineChartWidget.BLL.Repositories
{
    public class Repository
    {
        LineChartDomain db;
        public Repository()
        {
            db = new LineChartDomain();
        }

        // get sales by date
        public List<DataList> GetSalesByDate(string from_date, string to_date)
        {
            List<DataList> list = new List<DataList>();

            if (db.isOpen())
            {
                var reader = db.GetSalesByDate(from_date, to_date);
                while (reader.Read())
                {
                    DataList l = new DataList();
                    l.product_id = Convert.ToInt32(reader["product_id"]);
                    l.product_name = reader["product_name"].ToString();
                    l.quantity = Convert.ToInt32(reader["quantity"]);
                    l.sales_date = Convert.ToDateTime(reader["sales_date"]).ToString("MM.dd.yyyy");
                    list.Add(l);
                }
            }

            db.Close();

            return list;
        }

    }
}