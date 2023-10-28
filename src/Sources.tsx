import { useMutation, usePaginatedQuery } from "convex/react";
import { Button, Table } from "@rewind-ui/core";
import { api } from "../convex/_generated/api";

export function Sources() {
  const {
    status,
    loadMore,
    results: sources,
  } = usePaginatedQuery(api.sources.paginate, {}, { initialNumItems: 10 });
  const deleteSource = useMutation(api.sources.deleteSource);
  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th align="left">Source</Table.Th>
            <Table.Th align="left">Chunks</Table.Th>
            <Table.Th align="left">Content</Table.Th>
            <Table.Th align="left">Tokens</Table.Th>
            <Table.Th align="left"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sources.map((source) => (
            <Table.Tr key={source._id}>
              <Table.Td>{source.name}</Table.Td>
              <Table.Td>{source.chunkIds.length}</Table.Td>
              <Table.Td>
                <p className="line-clamp-3">{source.firstChunkText}</p>
              </Table.Td>
              <Table.Td>
                {source.saved ? source.totalTokens : "Unsaved"}
              </Table.Td>
              <Table.Td>
                <Button
                  color="red"
                  onClick={() => deleteSource({ id: source._id })}
                >
                  Delete
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {status !== "Exhausted" && (
        <Button
          onClick={() => loadMore(10)}
          disabled={status !== "CanLoadMore"}
        >
          Load More
        </Button>
      )}
    </>
  );
}
