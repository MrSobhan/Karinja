import { Accordion, AccordionItem } from "@heroui/accordion";
import {Input} from "@heroui/input";

export default function IndexPage() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <>
      <Accordion>
        <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
          {defaultContent}
        </AccordionItem>
        <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
          {defaultContent}
        </AccordionItem>
        <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
          {defaultContent}
        </AccordionItem>
      </Accordion>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input label="Email" type="email" />
        <Input label="Email" placeholder="Enter your email" type="email" />
      </div>
    </>
  );
}
