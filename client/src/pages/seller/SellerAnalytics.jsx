import {BarChart, DoughnutChart} from '../../utils/resource/ComponentsProvider.util'
import PieChartGender from '../../components/seller_components/ChartsComponents/PieChartGender'
import PieChartAge from '../../components/seller_components/ChartsComponents/PieChartAge'
import BarChartLocation from '../../components/seller_components/ChartsComponents/BarChartLocation'
const SellerAnalytics = () => {
  return (
    <>
      <div className="chartdiv w-full rounded-md flex gap-x-4 mt-2">
        <BarChart/>
        <DoughnutChart/>
      </div>

      <div className="chartdiv w-full rounded-md flex gap-x-4 mt-2">
        <PieChartGender/>
        <BarChartLocation/>
        <PieChartAge/>
      </div>
    </>
  )
}

export default SellerAnalytics