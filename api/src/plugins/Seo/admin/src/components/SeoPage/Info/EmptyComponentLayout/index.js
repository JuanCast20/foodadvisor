import React, { useState } from 'react';

import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { TextInput } from '@strapi/design-system/TextInput';
import { Tooltip } from '@strapi/design-system/Tooltip';
import { EmptyStateLayout } from '@strapi/design-system/EmptyStateLayout';

import { createSeoComponent } from '../../../../utils/api';
import { useAutoReloadOverlayBlocker } from '@strapi/helper-plugin';

import Plus from '@strapi/icons/Plus';
import Information from '@strapi/icons/Information';
import { Illo } from './illo';

const EmptyComponentLayout = ({ setShouldEffect }) => {
  const [error, setError] = useState(false);
  const [content, setContent] = useState(
    'https://github.com/strapi/components'
  );
  const re = new RegExp(
    '(?:https://)github.com(/)(d*[a-zA-Z][a-zA-Z0-9]*)(/)(d*[a-zA-Z][a-zA-Z0-9]*)'
  );

  const { lockAppWithAutoreload, unlockAppWithAutoreload } =
    useAutoReloadOverlayBlocker();

  const handleError = (content) => {
    if (error) {
      return "GitHub repository doesn't contain shared.seo or shared.meta-social component";
    }

    return re.test(content)
      ? undefined
      : 'Please provide a Github repository URL';
  };

  const handleClick = async () => {
    try {
      lockAppWithAutoreload();
      const data = await createSeoComponent(content);
      if (!data) setError(true);
    } catch (error) {
      console.log(error);
    } finally {
      unlockAppWithAutoreload();
      setShouldEffect(true);
    }
  };

  return (
    <Box padding={8} background="neutral100">
      <EmptyStateLayout
        icon={<Illo />}
        content="You don't have any content yet..."
        action={
          <>
            <TextInput
              placeholder="This is a content placeholder"
              label="Content"
              name="content"
              hint="Description line"
              error={handleError(content)}
              onChange={(e) => setContent(e.target.value)}
              value={content}
              labelAction={
                <Tooltip description="Content of the tooltip">
                  <button
                    aria-label="Information about the email"
                    style={{
                      border: 'none',
                      padding: 0,
                      background: 'transparent',
                    }}
                  >
                    <Information aria-hidden={true} />
                  </button>
                </Tooltip>
              }
            />
            <Button
              variant="secondary"
              startIcon={<Plus />}
              onClick={handleClick}
            >
              Create your first content-type
            </Button>
          </>
        }
      />
    </Box>
  );
};

export default EmptyComponentLayout;
