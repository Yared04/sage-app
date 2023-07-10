import React, { useState, useEffect, useContext, use } from "react";
import Image from "next/image";
import { Button } from "../components/Button";
import { Item } from "../components/Item";
import Link from "next/link";
import Nav from "../components/Nav";
import axios from "axios";
import { Project } from "@/types/Project";
import { AppContext } from "./_app";

const Home = () => {
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const { state } = useContext(AppContext);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = state.curUser && state.curUser.id;
        const response = await axios.get(
          `http://localhost:8080/api/projects/user/${userId}`
        );
        setUserProjects(response.data.projects);
        setCurrentPage(1); // Reset current page when projects are fetched
      } catch (error) {
        console.error("Error fetching data centers:", error);
        setUserProjects([]);
      }
    };

    fetchProjects();
  }, [state.curUser]);
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = userProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the range of projects to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleProjects = userProjects.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <nav>
        <Nav />
      </nav>
      <main className="sm:flex gap-8 lg:gap-10 mx-7 md:mx-20">
        <div className="basis-1 sm:basis-3/5">
          <p className="text-3xl font-bold text-primary">Previous Projects</p>
          <div className="mt-10 flex flex-col gap-7">
            {visibleProjects.map((project, index) => (
              <Link key={project._id} href={`/projects/${project._id}`}>
                <Item
                  props={{ ...project, color_flag: index % 2 ? true : false }}
                />
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  className="mx-1 px-2 py-1 rounded-md bg-primary text-white active:bg-primary-dark hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition ease-in-out duration-150  disabled:opacity-50"
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  disabled={currentPage === index + 1}
                >
                  {index + 1}{" "}
                </button>
              ))}
            </div>
          )}
          <Link className="flex justify-end mt-8" href="/create">
            <Button title="New" size="md" />
          </Link>
        </div>
        <div className="hidden sm:basis-1/2 sm:flex justify-center items-center">
          <Image src="/img1.jpg" width={500} height={500} alt="img-1" />
        </div>
      </main>
    </>
  );
};

export default Home;
