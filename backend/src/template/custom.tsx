import * as React from 'react';
import { Html, Button, Heading, Text } from '@react-email/components';
import { render } from '@react-email/render';

export type Properties = {
    name: string;
    url: string;
}

/**
 * @description
 * @param param0 
 * @returns 
 */
function CustomTemplate({ name, url }: Properties) {
    return (
        <Html>
            <Heading> Hello, {name} </Heading>
            <Text>
                Example of a text
            </Text>

            <Button href={url}>Click here</Button>
        </Html>
    );
}

export const renderCustomTemplate = (data: Properties) => {
    return render(<CustomTemplate name={data.name} url={data.url} />);
}