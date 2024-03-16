import { functions } from "$lib/firebase/client";
import { httpsCallable } from 'firebase/functions';
import logger from 'firebase-functions/logger';

const processEntity = httpsCallable(functions, 'processEntity');

export const GET = async ({ url, locals }) => {

  const isUserAdmin = locals?.user?.admin || false
  const collectionId = url.searchParams.get('collectionId')
  const task = url.searchParams.get('task')
  const userId = url.searchParams.get('userId')

  if (!isUserAdmin || !userId || !task) {
    const message = `Invalid GET request for users admin: ${isUserAdmin}, userId: ${userId}, task: ${task}.`
    logger.error(message)

    return new Response(JSON.stringify({ message }), {
      status: 400
    });
  }

  try {
    const response = await processEntity({ entity: 'Users', task, userId, collectionId })
    return new Response(JSON.stringify(response?.data?.collections || []), {
      status: typeof response?.data?.status === 'number' ? response.data.status : 500
    });
  } catch (error) {
    console.log('error in api users', error)
    const message = `Failed request for users: isUserAdmin: ${isUserAdmin}, id: ${id}, task: ${task}. error: ${error?.message || 'No message found'}, status: ${error?.status || 'No status found'}`
    logger.error('Failed to process the request for users admin ', message)
    return new Response(JSON.stringify({ message }), {
      status: error?.status ? error?.status : 500
    });
  }
};