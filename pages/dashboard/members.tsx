import type { NextPage } from "next";
import Layout from "../../components/layout";
import useSWR, { mutate } from "swr";
import fetcher from "../../utils/fetcher";
import { useState } from "react";
import { LoadSpinner } from "../../components/loadingSpinner";
import poster from "../../utils/poster";
import { DataTable } from "../../components/dataTable/DataTable";
import { memberType } from "../../types/types";
import { toast } from "sonner";

const Members: NextPage = () =>
{
  const { data, error, isLoading } = useSWR("/api/members", fetcher);
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Unable to retrieve member data."
  );

  if (error)
  {
    toast.error(`Contacts Error: ${errorMessage}`);
    return (
      <Layout>
        <div className="grid h-full place-content-center">
          <h1 className="text-red-600 font-bold text-4xl text-center">
            Contacts Page Error
          </h1>
          <h2 className="mt-2 text-white font-medium text-2xl text-center">
            {errorMessage}
          </h2>
        </div>
      </Layout>
    );
  }

  if (isLoading)
  {
    return (
      <Layout>
        <div className="grid h-screen place-content-center">
          <LoadSpinner />
        </div>
      </Layout>
    );
  }

  console.log(data);

  const user = {
    uh_id: 1111117,
    email: "testa@ibm.com",
    first_name: "Testy",
    last_name: "Test",
    phone_number: 1112223435,
    shirt_size_id: "XXS",
  };

  const rows = data.map((row: memberType) =>
    [
      row.contact_id,
      row.uh_id,
      row.first_name,
      row.last_name,
      row.email,
      row.phone_number,
      row.shirt_size_id,
      row.timestamp
    ]
  );

  return (
    <Layout>
      <br />
      <button onClick={async () =>
      {
        setError(false);

        const res = await poster("/api/members", user);

        if (res.error)
        {
          setError(true);
          setErrorMessage(res.description);
          toast.error(`Contacts Error: ${res.description}`);
          return;
        }

        toast.success(`Successfully added ${user.first_name}.`);
        mutate("/api/members", data, false);
      }} className="px-4 text-white font-semibold text-sm h-9 rounded-sm bg-red-600 hover:bg-red-700">
        Add Member
      </button>

      {isLoading ? <a>loading...</a> : <DataTable className="mt-4" columns={[
        "Contact ID",
        "UH ID",
        "First",
        "Last",
        "Email",
        "Phone",
        "Shirt",
        "Timestamp"
      ]}
        rows={rows}
      />}
    </Layout>
  );
};

export default Members;