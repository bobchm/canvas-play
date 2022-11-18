import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "react-headless-accordion";

import "./accordion-menu.styles.scss";

const AccordionMenu = ({ items, callback }) => {
    return (
        <Accordion>
            {items.map((item, idx) => (
                <AccordionItem key={idx}>
                    <AccordionHeader className="w-full flex item-center justify-between px-4 py-3 text-white/70 hover:text-white transition-all duration-400">
                        <div className="my-header flex items-center space-x-3">
                            {item.name}
                        </div>
                    </AccordionHeader>

                    <AccordionBody>
                        {item.children.map((child, cidx) => (
                            <div
                                className="my-item"
                                key={cidx}
                                onClick={() => callback(child)}
                                // className="accordion-body"
                            >
                                {child}
                            </div>
                        ))}
                    </AccordionBody>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default AccordionMenu;
