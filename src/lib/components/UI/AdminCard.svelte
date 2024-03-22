<script lang="ts">
  import { Card } from 'flowbite-svelte';

  export let href: string;
  export let cardName: string;
  export let length: number;
</script>

<Card {href}>
  <div class="shadow rounded-2xl p-4 bg-white">
    <div class="flex items-center">
      <p class="text-md text-black ml-2">{cardName}</p>
    </div>
    <div class="flex flex-col justify-start">
      <p class="text-gray-700 text-4xl text-left font-bold my-4">
        {length}
      </p>
    </div>
  </div>
</Card>
