import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Controller, useForm } from "react-hook-form";
import { PinInput } from "../../pininput";
import { Rating } from "../../rating";
import { Slider } from "../../slider";
import { TimePicker } from "../../timepicker";
import { Field } from "..";

interface Values {
  code: string;
  rating: number;
  time: string;
  volume: number;
}

const defaultValues: Values = { code: "", rating: 2, time: "", volume: 40 };

function SettingsForm({
  onSubmit,
}: {
  onSubmit: (values: Values) => void;
}): React.ReactNode {
  const { control, handleSubmit, reset } = useForm<Values>({ defaultValues });

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
    >
      <Controller
        control={control}
        name="volume"
        render={({ field }) => (
          <Field label="Volume">
            <Slider
              name={field.name}
              onValueChange={field.onChange}
              value={field.value}
            />
          </Field>
        )}
      />
      <Controller
        control={control}
        name="rating"
        render={({ field }) => (
          <Rating
            aria-label="Rating"
            name={field.name}
            onValueChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <PinInput
            aria-label="Code"
            length={4}
            name={field.name}
            onValueChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name="time"
        render={({ field }) => (
          <TimePicker
            aria-label="Time"
            inputRef={field.ref}
            onValueChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <button type="submit">Save</button>
      <button onClick={() => reset()} type="button">
        Reset
      </button>
    </form>
  );
}

const press = (name: string): void => {
  fireEvent.click(screen.getByRole("button", { name }));
};

describe("controls that go through Controller", () => {
  it("start with the default values of the form", () => {
    render(<SettingsForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveValue("40");
    expect(
      screen
        .getAllByRole("radio")
        .find((radio) => (radio as HTMLInputElement).checked),
    ).toBe(screen.getAllByRole("radio")[1]);
  });

  it("submit what the user picked", async () => {
    const onSubmit = vi.fn();
    render(<SettingsForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByRole("slider", { name: "Volume" }), {
      target: { value: "75" },
    });
    fireEvent.click(screen.getAllByRole("radio")[3]);
    await userEvent.type(screen.getAllByRole("textbox")[0], "1234");
    await userEvent.type(
      screen.getByRole("textbox", { name: "Time" }),
      "14:30",
    );
    press("Save");

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(onSubmit.mock.calls[0][0]).toEqual({
      code: "1234",
      rating: 4,
      time: "14:30",
      volume: 75,
    });
  });

  it("go back to the default values on reset", async () => {
    render(<SettingsForm onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByRole("slider", { name: "Volume" }), {
      target: { value: "75" },
    });
    fireEvent.click(screen.getAllByRole("radio")[3]);
    press("Reset");

    await waitFor(() => {
      expect(screen.getByRole("slider", { name: "Volume" })).toHaveValue("40");
    });
    expect(screen.getAllByRole("radio")[1]).toBeChecked();
  });
});
