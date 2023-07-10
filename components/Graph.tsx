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
      carbonFootprints: carbonFootprintsSum,
      cost: dataCenter.dataCenter.hourlyPrice.value * dataCenter.runtime,
      location: dataCenter.dataCenter.location,
    };
  });

  return (
    <ResponsiveContainer width="99%" height={350}>
      <ScatterChart margin={{ top: 10, bottom: 15, left: 10 }}>
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
        <YAxis type="number" dataKey="cost" name="Cost" unit="">
          <Label
            value="Cost ($)"
            position="insideLeft"
            angle={-90}
            offset={0}
          />
        </YAxis>
        <Tooltip cursor={{ strokeDasharray: "5 5" }} />
        <Scatter name="Data Centers" data={nodes} fill="#00274c" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export { Graph };
