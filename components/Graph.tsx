import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

interface GraphProps {
  data: any[];
  selectedCFs: {
    operational: boolean;
    embodied: boolean;
    dataTransfer: boolean;
    batteryStorage: boolean;
  };
}

const Graph: React.FC<GraphProps> = ({ data, selectedCFs }) => {
  const nodes = data.map((dataCenter) => {
    let carbonFootprintsSum = 0;

    if (selectedCFs.operational) {
      carbonFootprintsSum += dataCenter.OperationalCarbonFootprint || 0;
    }

    if (selectedCFs.embodied) {
      carbonFootprintsSum += dataCenter.EmbodiedCarbonFootprint || 0;
    }

    if (selectedCFs.dataTransfer) {
      carbonFootprintsSum += dataCenter.DataTransferCarbonFootprint || 0;
    }

    if (selectedCFs.batteryStorage) {
      carbonFootprintsSum += dataCenter.BatteryStorageCarbonFootprint || 0;
    }

    return {
      carbonFootprints: parseFloat(carbonFootprintsSum.toFixed(2)),
      cost: parseFloat(
        (dataCenter.dataCenter.hourlyPrice.value * dataCenter.runtime).toFixed(
          2
        )
      ),
      location: dataCenter.dataCenter.location,
      name: dataCenter.dataCenter.name,
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="p-3 border-2 bg-slate-50 rounded-md ">
          <p className="font-bold">{`${dataPoint.name}`}</p>
          <p className="">
            {" "}
            <span className="font-semibold">Carbon Footprints</span>:{" "}
            {dataPoint.carbonFootprints} kg
          </p>
          <p className="">
            {" "}
            <span className="font-semibold">Cost</span>: {dataPoint.cost} USD
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="99%" height={350}>
      <ScatterChart margin={{ top: 10, bottom: 15, left: 25, right: 15 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="carbonFootprints"
          name="Emission"
          unit=" kg"
        >
          <Label
            value="Carbon Emission (CO2 equivalent)"
            position="insideBottom"
            offset={-10}
          />
        </XAxis>
        <YAxis type="number" dataKey="cost" name="Cost" unit=" USD">
          <Label
            value="Cost ($)"
            position="insideLeft"
            angle={-90}
            offset={-15}
          />
        </YAxis>
        <Tooltip
          cursor={{ strokeDasharray: "5 5" }}
          content={<CustomTooltip />}
        />
        <Scatter name="Data Centers" data={nodes} fill="#00274c" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export { Graph };
