<script lang="ts">
	import { TableWrap } from '$lib/components';
	import {
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils';

	export let data: PageData;

	let updateModal = false;
	let groupObject: GroupObject;

	const { user, groups } = data;

	const tableData = {
		tableHead: ['Name', 'Joined', 'Creator', 'Moderator']
	};

	const getData = (appdata: MailTemplateRow) => {
		updateModal = true;
		groupObject = appdata;
	};
</script>

<TableWrap>
	<div
		class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
	>
		<div class="dark:bg-gray-900 p-4">
			<Heading tag="h3">Your Groups</Heading>
		</div>
		<div class="hidden-on-mobile">
			<div class="mt-4">
				<Table
					name="advancedTable"
					classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5"
					hoverable={true}
				>
					<TableHead>
						{#each tableData.tableHead as tableHead}
							<TableHeadCell class="text-center " padding="px-4 py-3" scope="col"
								>{tableHead}</TableHeadCell
							>
						{/each}
					</TableHead>
					<TableBody>
						{#each groups as group}
							{#each group.references as reference}
								<TableBodyRow class="border-none cursor-pointer" on:click={() => getData(group)}>
									<TableBodyCell>{reference.name}</TableBodyCell>
									<TableBodyCell
										>{formatDate({
											seconds: reference.joined.seconds,
											nanoseconds: reference.joined.nanoseconds
										})}</TableBodyCell
									>
									<TableBodyCell>{reference.creator}</TableBodyCell>
									<TableBodyCell>{reference.moderator}</TableBodyCell>
								</TableBodyRow>
							{/each}
						{/each}
					</TableBody>
				</Table>
			</div>
		</div>
	</div>
</TableWrap>
