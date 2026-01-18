
import { User, FilterParams, ApiResponse } from '../types';
import { generateMockUsers } from '../constants';

// Internal state to hold the "database"
const db: User[] = generateMockUsers(500);

export const fetchUsers = async (params: FilterParams): Promise<ApiResponse<User>> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 400));

  let filtered = db.filter(user => {
    // Search specifically by first and last name as requested
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const searchMatch = !params.search || 
      fullName.includes(params.search.toLowerCase());

    const nationalityMatch = !params.nationality || user.nationality === params.nationality;
    
    // Hobby specific filter
    const hobbyMatch = !params.hobby || user.hobbies.includes(params.hobby);
    
    const ageMatch = user.age >= params.minAge && user.age <= params.maxAge;

    return searchMatch && nationalityMatch && hobbyMatch && ageMatch;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / params.limit);
  const startIndex = (params.page - 1) * params.limit;
  const data = filtered.slice(startIndex, startIndex + params.limit);

  return {
    data,
    total,
    page: params.page,
    limit: params.limit,
    totalPages
  };
};

/**
 * Simulates a streaming response of 32 paragraphs.
 * Returns a Response object with a ReadableStream.
 */
export const streamLoremText = (): Response => {
  const paragraphs = [
    "In the heart of the digital landscape, where data flows like rivers through silicon valleys, the UserDirectory Pro engine pulses with life. It is a testament to the power of modern web architectures, where every byte is precious and every interaction is an opportunity for elegance. The architecture is built on the pillars of performance, accessibility, and aesthetic precision.",
    "As we delve deeper into the layers of the application, we see the intricate dance of state and effect. Hooks orchestrate the flow of information, while virtualization ensures that even the most massive datasets feel light and responsive. It is a world where infinite scrolls lead not to fatigue, but to discovery.",
    "The streaming protocol we observe here is a direct conduit to the source. It bypasses traditional batching, delivering content as it is forged. This 'character-by-character' paradigm is more than just a visual flourish; it is a philosophy of transparency, showing the user the very act of data creation and arrival.",
    "Consider the complexity of 32 paragraphs. To a human, it is a significant reading task. To the machine, it is a sequence of bits to be streamed, buffered, and rendered. Our task as engineers is to bridge this gap, creating a bridge that is both sturdy and beautiful.",
    "The following paragraphs represent the vastness of the generated content. Each word is a placeholder for potential, each sentence a frame in the animation of data delivery. We watch as the terminal fills, a digital scroll of lorem ipsum that signifies the robustness of the stream reader mechanism.",
    ...Array(27).fill("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")
  ].join("\n\n");

  const encoder = new TextEncoder();
  const data = encoder.encode(paragraphs);
  let offset = 0;
  const CHUNK_SIZE = 120; // Bytes per chunk

  const stream = new ReadableStream({
    async pull(controller) {
      if (offset >= data.length) {
        controller.close();
        return;
      }

      // Simulate network delay between chunks
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const chunk = data.slice(offset, offset + CHUNK_SIZE);
      controller.enqueue(chunk);
      offset += CHUNK_SIZE;
    }
  });

  return new Response(stream);
};
