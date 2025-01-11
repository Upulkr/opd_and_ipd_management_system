import { InputNicFormForOutPatient } from "@/components/input-id-models/nic-input-for-outPatient";
import { AddOutpatientForm } from "@/components/outpatient/addOutPatientDashBoard";
import { InventoryTracker } from "@/components/outpatient/inventory-tracker";
import { IPDAdmissions } from "@/components/outpatient/ipd-Admissions";
import { PersonSearchCard } from "@/components/outpatient/person-search-chart";
import { StaffDutyCard } from "@/components/outpatient/staff-duty-card";
import Statistics from "@/components/outpatient/statisticsForOutPAtientDashboard";
import { TodaysPatients } from "@/components/outpatient/todays-patients";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFrontendComponentsStore } from "@/stores/useFrontendComponentsStore";
import axios from "axios";
import { useEffect, useState } from "react";
function OutpatientDepartment() {
  const [showNicInput, setShowNicInput] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { enableAddOutPatient } = useFrontendComponentsStore((state) => state);
  const [todayOutPatients, setTodayOutPatients] = useState([]);
  const [error, setError] = useState("");

  const fetchTodayOutPatients = async () => {
    try {
      const response = await axios.get("http://localhost:8000/outPatient");
      if (response.status === 200) {
        setTodayOutPatients(response.data);
      }
    } catch (error: any) {
      if (error.status === 400) {
        setError(error.data.message);
      }
    }
  };

  useEffect(() => {
    fetchTodayOutPatients();
    if (enableAddOutPatient) {
      setActiveTab("add-outpatient");
    }
  }, [enableAddOutPatient]);

  return (
    <div className="container mx-auto p-4 relative">
      {showNicInput && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
          onClick={() => setShowNicInput(false)} // Close when clicking outside
        >
          <InputNicFormForOutPatient onClose={() => setShowNicInput(false)} />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">
        Outpatient Department Dashboard
      </h1>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger
            value="add-outpatient"
            onClick={() => setShowNicInput(true)}
          >
            Add Outpatient
          </TabsTrigger>

          <TabsTrigger value="inventory">Inventory</TabsTrigger>

          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Statistics numberOfTodayOutPatients={todayOutPatients?.length} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TodaysPatients todayOutPatients={todayOutPatients} error={error} />
            <IPDAdmissions />
          </div>
        </TabsContent>
        <TabsContent value="add-outpatient">
          <AddOutpatientForm setActiveTab={setActiveTab} />
        </TabsContent>
        <TabsContent value="prescriptions"></TabsContent>
        <TabsContent value="inventory">
          <InventoryTracker />
        </TabsContent>
        <TabsContent value="search">
          <PersonSearchCard />
        </TabsContent>
        <TabsContent value="staff">
          <StaffDutyCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OutpatientDepartment;
