import { useEffect } from "react";
import { PrimarySelect } from "../components/selects/PrimarySelect";
import { Mic } from "lucide-react";

export function Room() {
  useEffect(() => {}, []);

  return (
    <section className="flex items-center justify-center h-[100vh] w-full">
      <div>
        <PrimarySelect
          icon={<Mic className="text-black" />}
          label="Audio devices"
          placeholder="Default"
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
            { label: "Grapes", value: "grapes" },
          ]}
          value={""}
          onChange={() => {}}
        />
      </div>
    </section>
  );
}
