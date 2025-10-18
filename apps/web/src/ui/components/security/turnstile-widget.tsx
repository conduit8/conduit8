import { Turnstile as TurnstileOriginal } from '@marsidev/react-turnstile';
import React, { useState } from 'react';

import { settings } from '@web/lib/settings/settings';

interface TurnstileWidgetProps {
  onTokenChange: (token: string) => void;
  className?: string;
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onTokenChange,
  className = '',
}) => {
  const [_error, setError] = useState<string | null>(null);
  const [_isLoading, setIsLoading] = useState(true);

  const siteKeyDefined = !!settings.turnstile?.siteKey;

  if (!siteKeyDefined) {
    console.warn('Turnstile secret key is not set, turnstile widget not rendered');
    return null;
  }

  return (
    <div className={`${className} mt-4`}>
      <TurnstileOriginal
        siteKey={settings.turnstile?.siteKey || ''}
        onSuccess={(token) => {
          console.info('Turnstile verification successful', { tokenLength: token.length });
          setIsLoading(false);
          onTokenChange(token);
        }}
        onError={(errorCode) => {
          console.error('Turnstile verification failed', { errorCode });
          setError(`Failed to load (${errorCode})`);
          setIsLoading(false);
          // Don't update the token on error - this will keep it as an empty string
          // which won't be sent to the API
        }}
        onExpire={() => {
          console.warn('Turnstile token expired');
          setError('CAPTCHA expired');
          // Don't update the token on expire
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
        options={{
          theme: 'dark',
        }}
      />
    </div>
  );
};
