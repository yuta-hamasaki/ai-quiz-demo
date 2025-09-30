"use server"
import { client } from '@/lib/microcmsClient';

  export const fetchLandingText = async () => {
    const data = await client.get({
      endpoint: 'landing',
    })
    return data.contents
  }

  