import Nav from "../components/Nav";
import axios from "axios";
import { GetStaticProps } from "next";
import { DataCenter } from "@/types/DataCenter";
import Create from "../components/Create";

interface CreateProps {
  dataCenters: DataCenter[];
}

const CreatePage: React.FC<CreateProps> = ({ dataCenters }) => {
  return (
    <>
      <nav>
        <Nav />
      </nav>{" "}
      <main>
        <Create dataCenters={dataCenters} />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<CreateProps> = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/data-centers`
    );
    const dataCenters = response.data;
    return { props: { dataCenters } };
  } catch (error) {
    console.error("Error fetching data centers:", error);
    return { props: { dataCenters: [] } };
  }
};

export default CreatePage;
