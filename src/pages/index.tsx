import Head from "next/head";
import { KeyboardEvent, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { classNames } from "@/utils/tailwind";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState();
  const [loading, setLoading] = useState(false);

  async function search(query: string) {
    try {
      setLoading(true);

      const response = await axios.post("/api/search", {
        query,
      });

      const { message } = response.data;

      setAnswer(message);
    } catch (e) {
      console.log("Error searching: ", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Embeddings search</title>
        <meta
          name="description"
          content="Embeddings search using OpenAI and Pinecone"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative z-10">
        <div className="fixed inset-0">
          <Image
            layout="fill"
            objectFit="cover"
            quality={100}
            src="/background.jpg"
            alt="background"
          />
        </div>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <div className="mx-auto max-w-lg transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
            <Combobox
              // onChange={(person) => (window.location = person.url)}
              disabled={loading}
            >
              <div className="relative">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <Combobox.Input
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  onChange={(event) => setInput(event.target.value)}
                  onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    if (e.key === "Enter") {
                      search(input);
                    }
                  }}
                />
              </div>
              {/* 
              {filteredPeople.length > 0 && (
                <Combobox.Options
                  static
                  className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
                >
                  {filteredPeople.map((person) => (
                    <Combobox.Option
                      key={person.id}
                      value={person}
                      className={({ active }) =>
                        classNames(
                          "cursor-default select-none px-4 py-2",
                          active && "bg-indigo-600 text-white"
                        )
                      }
                    >
                      {person.first_name}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}

              {input !== "" && filteredPeople.length === 0 && (
                <p className="p-4 text-sm text-gray-500">No people found.</p>
              )} */}
            </Combobox>
          </div>

          <div className="mx-auto max-w-2xl mt-20 space-y-10 px-4 pb-10 sm:px-0">
            {/* Answer */}
            {answer && (
              <div>
                <div className="px-4 py-2 sm:py-3 sm:px-6">
                  <h2 className="text-sm font-medium text-gray-500">Answer</h2>
                </div>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:p-6">
                    <p className="text-lg text-gray-800">{answer}</p>
                  </div>
                </div>
              </div>
            )}

            {/* {result && (
              <div>
                <div className="px-4 py-2 sm:py-3 sm:px-6">
                  <h2 className="text-sm font-medium text-gray-500">Data</h2>
                </div>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="flex-none flex-col overflow-y-auto flex">
                    <div className="flex flex-auto flex-col justify-between px-4 py-5 sm:p-6">
                      <img
                        src=""
                        alt=""
                        className="mx-auto h-16 w-16 rounded-full"
                      />
                      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                        <dt className="col-end-1 font-semibold text-gray-900">
                          Name
                        </dt>
                        <dd>
                          {result.first_name} {result.last_name}
                        </dd>
                        <dt className="col-end-1 font-semibold text-gray-900">
                          Phone
                        </dt>
                        <dd>{result.email}</dd>
                        <dt className="col-end-1 font-semibold text-gray-900">
                          URL
                        </dt>
                        <dd className="truncate">
                          <a
                            href={result.ip_address}
                            className="text-indigo-600 underline"
                          >
                            {result.ip_address}
                          </a>
                        </dd>
                        <dt className="col-end-1 font-semibold text-gray-900">
                          Email
                        </dt>
                        <dd className="truncate">
                          <a
                            href={`mailto:${result.email}`}
                            className="text-indigo-600 underline"
                          >
                            {result.email}
                          </a>
                        </dd>
                      </dl>
                      <button
                        type="button"
                        className="mt-6 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Send message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}
