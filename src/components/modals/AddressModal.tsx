import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";

interface addressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AddressData) => void;
}

export interface AddressData {
  place: string;
  district: string;
  state: string;
  pincode: string;
  address: string;
}

const stateOptions = ["Kerala", "Tamilnadu", "Karnataka", "Maharastra"];
const districtOptions = ["Malappuram", "Ernakulam", "Trivandrum"];

const AddressModal = ({ open, onClose, onSave }: addressModalProps) => {
  const AddressSchema = Yup.object().shape({
    place: Yup.string().trim().required("Place is required"),
    district: Yup.string().trim().required("District is required"),
    state: Yup.string().trim().required("State is required"),
    pincode: Yup.string().trim().required("Pincode is required"),
    address: Yup.string().trim().required("Address is required"),
  });

  const initialValues: AddressData = {
    place: "",
    district: "",
    state: "",
    pincode: "",
    address: "",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Set Shipping Address</DialogTitle>
          <DialogDescription>
            Please enter your full address details to ensure accurate shipping.
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={AddressSchema}
          onSubmit={(values) => {
            onSave(values);
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="state" className="block mb-1">
                  State
                </label>
                <Field
                  as="select"
                  id="state"
                  name="state"
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select State</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="state"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <label htmlFor="district" className="block mb-1">
                  District
                </label>
                <Field
                  as="select"
                  id="district"
                  name="district"
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select District</option>
                  {districtOptions.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="district"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              

              <div>
                <label htmlFor="pincode" className="block mb-1">
                  Pincode
                </label>
                <Field
                  as={Input}
                  id="pincode"
                  name="pincode"
                  type="number"
                  placeholder="Enter pincode"
                />
                <ErrorMessage
                  name="pincode"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <label htmlFor="address" className="block mb-1">
                  Address
                </label>
                <Field
                  as={Input}
                  id="address"
                  name="address"
                  placeholder="Enter address"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>
              <div>
                <label htmlFor="place" className="block mb-1">
                  Place
                </label>
                <Field
                  as={Input}
                  id="place"
                  name="place"
                  placeholder="Enter place"
                />
                <ErrorMessage
                  name="place"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Address"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
